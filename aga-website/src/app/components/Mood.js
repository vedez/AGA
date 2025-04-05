import MoodTracker from "@/app/components/MoodTracker"

export default function Mood() {
    return(
        <div className="bg-gradient-to-r from-[#79d862] to-[#c9eb86] border-[#79d862] border-2 feature-element no-margin gap-5 flex flex-col">
            <MoodTracker />
        </div>
    );
}