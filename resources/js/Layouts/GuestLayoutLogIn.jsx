export default function GuestLayoutLogIn({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-white pt-6 sm:justify-center sm:pt-0">
            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-8 shadow-md sm:max-w-md sm:rounded-lg">
                <div className="mb-6 flex justify-center">
                    <img
                        src="https://i.imgur.com/GBcDgir.png"
                        alt="Logo"
                        className="h-16 object-contain"
                    />
                </div>
                {children}
            </div>
        </div>
    );
}
