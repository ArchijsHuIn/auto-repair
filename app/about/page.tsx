export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">About Our Auto Repair Shop Management System</h1>

            <div className="space-y-6 text-gray-700">
                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">Our Mission</h2>
                    <p className="text-lg leading-relaxed">
                        We're dedicated to providing auto repair shops with a powerful, easy-to-use management system 
                        that streamlines operations, tracks vehicle repairs, and helps deliver exceptional customer service.
                    </p>
                </section>

                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">Key Features</h2>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2 text-xl">✓</span>
                            <div>
                                <strong>Vehicle Management:</strong> Keep detailed records of all vehicles including 
                                license plates, VIN numbers, make, model, year, and owner information.
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2 text-xl">✓</span>
                            <div>
                                <strong>Work Order Tracking:</strong> Create and manage work orders with status tracking 
                                from diagnostic through completion, including customer complaints and internal notes.
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2 text-xl">✓</span>
                            <div>
                                <strong>Parts & Labor Management:</strong> Track labor hours and parts used for each job, 
                                with automatic cost calculations and invoicing.
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2 text-xl">✓</span>
                            <div>
                                <strong>Payment Processing:</strong> Monitor payment status and methods, ensuring accurate 
                                financial records for every work order.
                            </div>
                        </li>
                    </ul>
                </section>

                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">Technology Stack</h2>
                    <p className="mb-3">
                        Built with modern web technologies for performance, reliability, and scalability:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded">
                            <strong className="text-blue-600">Frontend:</strong>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• Next.js 16</li>
                                <li>• React 19</li>
                                <li>• TypeScript</li>
                                <li>• Tailwind CSS</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <strong className="text-blue-600">Backend:</strong>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• Prisma ORM</li>
                                <li>• PostgreSQL</li>
                                <li>• API Routes</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">Contact Us</h2>
                    <p className="mb-4">
                        Have questions or need support? We're here to help!
                    </p>
                    <div className="space-y-2">
                        <p><strong>Email:</strong> support@autorepairshop.com</p>
                        <p><strong>Phone:</strong> (555) 123-4567</p>
                        <p><strong>Hours:</strong> Monday - Friday, 9AM - 5PM EST</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
