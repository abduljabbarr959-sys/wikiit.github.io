# Duplicate

The **Duplicate** entry is a demonstration of how this wiki handles identical titles. Each entry must have a unique title — attempting to create an entry with a title that already exists will be rejected by the API.

## Try It Yourself

1. Navigate to **Create Entry**
2. Enter a title like "Python"
3. Write some content and submit
4. You'll see an error: `An entry with this title already exists.`

This validation is handled at both the API level (serializer unique validation) and the database level (unique constraint on the title field).

See also: [wikiit](/wiki/wikiit), [Python](/wiki/Python), [Django](/wiki/Django)
