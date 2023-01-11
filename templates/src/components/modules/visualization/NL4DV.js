import React, { useEffect, useRef } from "react"
import vegaEmbed from "vega-embed"

function NL4DV(props) {
  const { data } = props

  useEffect(() => {
    if (!data) {
      return <></>
    }

    async function init() {
      await vegaEmbed(".visualization", data.nl4dv, { actions: false })
    }
    init()
  }, [data])

  return (
    <>
      <div className="visualization" style={{ width: "230px", height: "100px" }}></div>
    </>
  )
}
export default NL4DV
