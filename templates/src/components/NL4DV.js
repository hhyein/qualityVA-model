import React, { useEffect, useRef } from 'react'
import vegaEmbed from 'vega-embed'

function NL4DV(props) {
  const { spec } = props

  useEffect(() => {
    if(!spec){ return (<></>) }

    async function init(){
      await vegaEmbed(".vis", spec.nl4dv,  {"actions": false})
    }
    init()
  }, [props.spec])

  return (
    <>
      <div className="vis" style={{width: "250px", height: "250px"}}></div>
    </>
  )
}
export default NL4DV
