import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className=" font-bold bg-gradient-to-r from-yellow-200 to-pink-400 text-transparent bg-clip-text">
    {" "}
        {text}
    </span>
  )
}

export default HighlightText