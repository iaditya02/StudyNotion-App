import React from "react";
import ContactUsForm from "../components/contactPage/ContactUsForm";
import ContactDetails from "../components/contactPage/ContactDetails";

const Contact = () => {
  return (
    <div className=" h-full">
      <div className="mt-12 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row mx-auto">
        <div className=" lg:w-[60%]">
            <ContactDetails/>
        </div>
        <div className=" lg:w-[60%]">
          <ContactUsForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
