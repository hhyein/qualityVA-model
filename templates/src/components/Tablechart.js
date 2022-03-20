import React from 'react';

function Tablechart(props) {
  const {data, onDataClick} = props;

  return (
    <>
      <div className="table">
        <table border={1} style={{ width: '100%'}}>
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => <td key={key}>{key}</td>)}
            </tr>
          </thead>
          <tbody>
            {data.map((el, i) => (
              <tr key={i.toString()}>
                {Object.entries(el).map(([k, v], j) => (
                  <td key={k} onClick={() => onDataClick(k, j)}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default Tablechart;
