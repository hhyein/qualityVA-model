import React, { useEffect, useRef } from 'react'
import VegaLite from 'react-vega-lite'

function NL4DV(props) {
  const { spec, data } = props

  useEffect(() => {
  }, [props.spec, props.data])

  return (
    <VegaLite spec={spec.NL4DV} data={data} />
  )
}
export default NL4DV