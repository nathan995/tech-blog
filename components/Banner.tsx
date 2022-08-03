import React from 'react'

function Banner() {
  return (
    <div>
      {/*
    <div className="flex items-center justify-between overflow-hidden bg-green-500 py-10 lg:rounded-lg lg:py-0">
      <div className=" absolute w-1/4 space-y-5 px-10 ">
        <h1 className="max-w-xl text-4xl text-white">
          Reporting on the business of technology, startups, venture capital
          funding, and Silicon Valley.
        </h1>
  </div>*/}
      <img
        className="hidden h-32 md:inline-flex md:h-full lg:rounded-lg"
        src="https://techcrunch.com/wp-content/uploads/2018/02/tc-backlight.png?w=1390&crop=1"
        alt=""
      />
    </div>
  )
}

export default Banner
