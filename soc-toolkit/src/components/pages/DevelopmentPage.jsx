function DevelopmentPage({ title }) {
  return (
    <section className="panel" aria-label={title.toLowerCase()}>
      <p className="section-label">Module</p>
      <h3>{title}</h3>
      <p>En desarrollo</p>
    </section>
  )
}

export default DevelopmentPage