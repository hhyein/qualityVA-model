import React from 'react'

function Tablechart(props) {
  const { data } = props

  return (
    <>
      <div className="table">
        <table border={1} style={{ minWidth: '100%' }}>
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map(key => <th key={key}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {data && data.map((el, i) => (
              <tr key={i.toString()}>
                {Object.entries(el).map(([k, v], j) => (
                  <td key={k} style={{ width: 'fit-content' }}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default Tablechart
