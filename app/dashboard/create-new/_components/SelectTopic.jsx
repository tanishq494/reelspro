"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const options = [
    'Custom Prompt','Random AI Story','Scary Story','Bedtime Story','Comedy'
]

function SelectTopic({onUserSelect}) {
    const [selectedOption, setSelectedOption] = useState()
  return (
        <div>
            <h2 className='text-2xl font-bold text-primary'>Content</h2>
            <p className='text-gray-600'>What is the topic of your video?</p>

            <Select onValueChange={(value) => {
                setSelectedOption(value)
                value!='Custom Prompt'&& onUserSelect('topic',value)
            }}>
                <SelectTrigger className="w-full mt-2 p-6 text-lg">
                    <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options.map((item) => (
                            <SelectItem key={item} value={item}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {selectedOption && selectedOption==='Custom Prompt' && (
                    <Textarea className="mt-3"
                     onChange={(e) => onUserSelect('topic', e.target.value)}
                     placeholder="Enter your custom prompt here..." />
            )}  
        </div>
)}

export default SelectTopic