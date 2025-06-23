export default function PageHeader({ 
  title, 
  description 
}: { 
  title: string
  description: string
}) {
  return (
    <header className="grid grid-cols-1 gap-4">
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  )
}