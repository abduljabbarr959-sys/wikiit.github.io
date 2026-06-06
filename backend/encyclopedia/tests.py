from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

from .models import Entry


class EntryAPITests(TestCase):

    def setUp(self):
        Entry.objects.create(title='Python', content='Python is a programming language...')

    def _list_results(self, response):
        return response.json()['results']

    def test_list_entries(self):
        response = self.client.get(reverse('api_entry_list'))
        self.assertEqual(response.status_code, 200)
        results = self._list_results(response)
        self.assertIn('title', results[0])
        self.assertIn('snippet', results[0])
        self.assertIn('updated_at', results[0])
        self.assertEqual(results[0]['title'], 'Python')

    def test_list_entries_search(self):
        response = self.client.get(reverse('api_entry_list') + '?search=ytho')
        self.assertEqual(response.status_code, 200)
        results = self._list_results(response)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], 'Python')

    def test_entry_detail_found(self):
        response = self.client.get(
            reverse('api_entry_detail', kwargs={'title': 'Python'})
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['title'], 'Python')
        self.assertIn('Python is a programming language', data['content'])
        self.assertIn('author', data)
        self.assertIn('created_at', data)
        self.assertIn('updated_at', data)

    def test_entry_detail_not_found(self):
        response = self.client.get(
            reverse('api_entry_detail', kwargs={'title': 'NonExistent'})
        )
        self.assertEqual(response.status_code, 404)

    def test_create_entry(self):
        response = self.client.post(reverse('api_create_entry'), {
            'title': 'MyNewEntry',
            'content': '# Hello World'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['title'], 'MyNewEntry')

    def test_create_duplicate(self):
        self.client.post(reverse('api_create_entry'), {
            'title': 'Duplicate', 'content': 'content'
        }, content_type='application/json')
        response = self.client.post(reverse('api_create_entry'), {
            'title': 'Duplicate', 'content': 'content'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 409)

    def test_create_empty_title(self):
        response = self.client.post(reverse('api_create_entry'), {
            'title': '', 'content': 'content'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_update_entry(self):
        response = self.client.put(
            reverse('api_entry_detail', kwargs={'title': 'Python'}),
            {'content': '# Updated Python'},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['content'], '# Updated Python')

    def test_delete_entry(self):
        Entry.objects.create(title='ToDelete', content='content')
        response = self.client.delete(
            reverse('api_entry_detail', kwargs={'title': 'ToDelete'})
        )
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Entry.objects.filter(title='ToDelete').exists())

    def test_delete_nonexistent(self):
        response = self.client.delete(
            reverse('api_entry_detail', kwargs={'title': 'NonExistent'})
        )
        self.assertEqual(response.status_code, 404)

    def test_create_entry_sets_author_when_authenticated(self):
        user = User.objects.create_user(username='testuser', password='pass123')
        self.client.login(username='testuser', password='pass123')
        response = self.client.post(reverse('api_create_entry'), {
            'title': 'AuthoredPage',
            'content': 'Created by a user'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['author'], 'testuser')

    def test_entry_author_is_null_for_anonymous(self):
        response = self.client.post(reverse('api_create_entry'), {
            'title': 'AnonymousPage',
            'content': 'No author'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertIsNone(response.json()['author'])

    def test_list_pagination(self):
        for i in range(5):
            Entry.objects.create(title=f'Page{i}', content='x')
        response = self.client.get(reverse('api_entry_list'))
        data = response.json()
        self.assertIn('count', data)
        self.assertIn('results', data)
        self.assertIn('next', data)
        self.assertIn('previous', data)
        self.assertGreaterEqual(data['count'], 6)

class AuthAPITests(TestCase):

    def test_register(self):
        response = self.client.post(reverse('api_register'), {
            'username': 'newuser',
            'password': 'StrongPass1',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['username'], 'newuser')

    def test_register_duplicate_username(self):
        User.objects.create_user(username='newuser', password='StrongPass1')
        response = self.client.post(reverse('api_register'), {
            'username': 'newuser',
            'password': 'StrongPass2',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_register_short_password(self):
        response = self.client.post(reverse('api_register'), {
            'username': 'newuser2',
            'password': 'ab',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_login(self):
        User.objects.create_user(username='testuser', password='pass123')
        response = self.client.post(reverse('api_login'), {
            'username': 'testuser',
            'password': 'pass123',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['username'], 'testuser')

    def test_login_invalid(self):
        response = self.client.post(reverse('api_login'), {
            'username': 'nobody',
            'password': 'wrong',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_me_authenticated(self):
        user = User.objects.create_user(username='testuser', password='pass123')
        self.client.login(username='testuser', password='pass123')
        response = self.client.get(reverse('api_me'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['authenticated'])
        self.assertEqual(response.json()['username'], 'testuser')

    def test_me_anonymous(self):
        response = self.client.get(reverse('api_me'))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()['authenticated'])

    def test_logout(self):
        user = User.objects.create_user(username='testuser', password='pass123')
        self.client.login(username='testuser', password='pass123')
        response = self.client.post(reverse('api_logout'))
        self.assertEqual(response.status_code, 204)
        me = self.client.get(reverse('api_me'))
        self.assertFalse(me.json()['authenticated'])

    def test_password_reset_missing_email(self):
        response = self.client.post(reverse('api_password_reset'), {}, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_password_reset_unknown_email(self):
        response = self.client.post(reverse('api_password_reset'), {
            'email': 'none@example.com'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_password_reset_known_email(self):
        User.objects.create_user(
            username='testuser', password='pass123',
            email='test@example.com'
        )
        response = self.client.post(reverse('api_password_reset'), {
            'email': 'test@example.com'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
