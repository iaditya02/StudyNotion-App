import React from 'react'
import { IoIosChatboxes } from "react-icons/io";
import { GiWorld } from "react-icons/gi";
import { MdCallEnd } from "react-icons/md";

const ContactDetails = () => {
  return (
    <div>
        <div className='flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6'>
                <div className='flex flex-col gap-[2px] p-3 text-sm text-richblack-200'>
                    <div className='flex flex-row items-center gap-3'>
                    <IoIosChatboxes fontSize={25}/>
                    <h1 className="text-lg font-semibold text-richblack-5">Chat on us</h1>
                    </div>
                    <p className='font-medium'>Our friendly team is here to help.</p>
                    <p className='font-semibold'>info@studynotion.com</p>
                </div>
                <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
                    <div className='flex flex-row items-center gap-3'>
                    <GiWorld fontSize={25}/>
                    <h1 className="text-lg font-semibold text-richblack-5">Visit us</h1>
                    </div>
                    <p className='font-medium'>Come and say hello at our office HQ.</p>
                    <p className='font-semibold'>Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016</p>
                </div>
                <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
                    <div className='flex flex-row items-center gap-3'>
                    <MdCallEnd fontSize={25}/>
                    <h1 className="text-lg font-semibold text-richblack-5">Call us</h1>
                </div>
                <p className='font-medium'>Mon - Fri From 8am to 5pm</p>
                <p className='font-semibold'>+91 6366 000 666</p>
                </div>
            </div>
    </div>
  )
}

export default ContactDetails