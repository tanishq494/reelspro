import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SelectDuration({ onUserSelect }) {
    return (
       <div className="mt-7">
            <h2 className='text-2xl font-bold text-primary'>Duration</h2>
            <p className='text-gray-600'>How long should your video be?</p>
            <Select onValueChange={(value) => onUserSelect('duration', value)}>
                <SelectTrigger className="w-full mt-2 p-6 text-lg">
                    <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default SelectDuration