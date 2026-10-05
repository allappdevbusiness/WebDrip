export default function SectionHead({ kicker, title, copy, id, align = 'left' }) {
  return (
    <div className={`wd-head ${align === 'center' ? 'mx-auto text-center' : ''}`} data-reveal="mask">
      <p className="wd-mono wd-kicker">{kicker}</p>
      <h2 id={id} className="wd-h2">
        {title}
      </h2>
      {copy && <p className="wd-lead">{copy}</p>}
    </div>
  );
}
