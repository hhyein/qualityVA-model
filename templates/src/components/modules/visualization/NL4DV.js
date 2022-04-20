import React, { useEffect, useRef } from "react"
import vegaEmbed from "vega-embed"

function NL4DV(props) {
  const { spec } = props

  useEffect(() => {
    if (!spec) {
      return <></>
    }

    async function init() {
      await vegaEmbed(".vis", spec.nl4dv, { actions: false })
    }
    init()
  }, [spec])

  return (
    <>
      <div className="vis" style={{ width: "270px", height: "150px" }}></div>
    </>
  )
}
export default NL4DV
