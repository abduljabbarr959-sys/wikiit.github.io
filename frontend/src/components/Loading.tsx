interface Props {
  text?: string
  size?: 'small' | 'medium'
}

export default function Loading({ text, size = 'medium' }: Props) {
  if (size === 'small') {
    return <span className="spinner spinner-small" />
  }

  return (
    <div className="loading-spinner">
      <div className="spinner" />
      {text && <p>{text}</p>}
    </div>
  )
}
