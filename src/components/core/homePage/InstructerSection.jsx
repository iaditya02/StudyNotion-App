import React from 'react'
import Instructor from "../../../assets/images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from "../homePage/Button"
import { FaArrowRight } from 'react-icons/fa6'

const InstructerSection = () => {
  return (
    <div className=' mt-14'>
        <div className='flex flex-col md:flex-row gap-20 items-center'>

            <div className=' w-[50%]'>
                <img src={Instructor} alt='Instructor' className=' shadow-white'></img>
            </div>

            <div className='md:w-[50%] flex flex-col gap-10 items-center'>
                <div className=' text-4xl font-semibold md:w-[50%] text-center'>
                    Become an <HighlightText text={"Instructor"}/>
                </div>
                <p className=' text-[16px] w-[80%] font-medium text-richblack-300'>
                    Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach and skills to teach what you love.
                </p>
                <div className=' w-fit'>
                <CTAButton active={true} linkto={"/signup"}>
                    <div className=' flex gap-2 items-center'>
                        Start Teaching Today!
                        <FaArrowRight/>
                    </div>
                </CTAButton>
                </div>
            </div>

        </div>
    </div>
  )
}

export default InstructerSection