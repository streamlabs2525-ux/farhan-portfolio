export default function Footer() {
    return (
        <footer className="w-full bg-[#050505] py-10 border-t border-[#1a1a1a] mt-auto">
            <div className="flex justify-center">
                <p>&copy; {new Date().getFullYear()} Farhan Tanvir. All rights reserved.</p>
            </div>
        </footer>
    );
}
