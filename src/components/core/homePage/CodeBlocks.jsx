import React from 'react'
import CTAButton from "./Button"
import { FaArrowRight } from "react-icons/fa6";
import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = ({
    position,
    heading,
    subHeading,ctabtn1,ctabtn2,codeBlock,bgGradient,codeColor
}) => {
  return (
    <div className={` flex ${position} my-20 justify-between gap-10`}>


    {/*section 1*/}
    <div className=' w-[100%] lg:w-[50%] flex flex-col gap-8'>
        {heading}
        <div className='text-richblack-300 font-bold text-base w-[85%] -mt-3'>
            {subHeading}
        </div>

        <div className=' flex gap-7 mt-7'>
            <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className='flex items-center gap-2'>
                {ctabtn1.btnText}
                <FaArrowRight/>
            </div>

            </CTAButton>

            <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            
                {ctabtn2.btnText}

            </CTAButton>

        </div>
    </div>

    {/*section 2*/}

    <div className=' h-fit flex flex-row text-[11px] w-[100%] py-4 lg:w-[480px] sm:text-sm leading-[18px] sm:leading-6 relative'>
    {bgGradient}
        <div className=' flex flex-col text-center w-[10%] text-richblack-400 font-inter font-bold select-none'>
        <p>1</p>
        <p>2</p>
        <p>3</p>
        <p>4</p>
        <p>5</p>
        <p>6</p>
        <p>7</p>
        <p>8</p>
        <p>9</p>
        <p>10</p>
        <p>11</p>
        </div>
        <div className={ `w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
        <TypeAnimation
            sequence={[codeBlock,3000,""]}
            repeat={Infinity}
            cursor={true}
            style={
                {
                    whiteSpace:"pre-line",
                    display:"block"
                }
            }
            omitDeletionAnimation={true}
        />

        </div>
    </div>

    </div>
  )
}

export default CodeBlocks