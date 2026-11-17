import Image from "next/image"
import { useState } from "react"

function SelectStyle({ onUserSelect }) {
    const StylesOptions = [
        {
            name: 'Realistic',
            image: '/Realistic.png'
        },
        {
            name: 'Disney',
            image: '/Disney.png'
        },
        {
            name: 'Comics',
            image: '/Comic.png'
        },
        {
            name: 'Water Colors',
            image: '/WaterColor.png'
        },
        {
            name: 'GTA',
            image: '/GTA.png'
        },
    ]

    const [selectedOption, setSelectedOption] = useState(null)

    return (
        <div className="mt-7">
            <h2 className='text-2xl font-bold text-primary'>Style</h2>
            <p className='text-gray-600'>Choose a style for your video</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-3">
                {StylesOptions.map((item, index) => (
                    <div key={index} className={`relative hover:scale-105 transition-all cursor-pointer
                        ${selectedOption == item.name && 'border-4 border-primary rounded-xl'}`}>

                        <Image src={item.image} alt={item.name} width={100} height={100} 
                            className="h-48 object-cover rounded-lg w-full"
                            onClick={() => { 
                                setSelectedOption(item.name)
                                onUserSelect('image-style', item.name)
                            }}/>

                        <h2 className='absolute p-1 bg-black bottom-0 w-full text-white text-center rounded-b-lg'>
                            {item.name}
                        </h2>
                    </div>
                ))}
            </div> 

        </div>
    )
}

export default SelectStyle