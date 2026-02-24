import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full bg-[#050505] py-10 border-t border-[#1a1a1a] mt-auto">
            <div className="flex flex-col items-center justify-center space-y-4">
                <p>&copy; {new Date().getFullYear()} Farhan Tanvir. All rights reserved.</p>
                <Link href="/yeasin_arafat" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                </Link>
            </div>
        </footer>
    );
}
