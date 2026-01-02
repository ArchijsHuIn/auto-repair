export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Par mūsu autoservisa pārvaldības sistēmu</h1>

            <div className="space-y-6 text-gray-700">
                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">Mūsu misija</h2>
                    <p className="text-lg leading-relaxed">
                        Mēs esam apņēmušies nodrošināt autoservisus ar jaudīgu, viegli lietojamu pārvaldības sistēmu, 
                        kas optimizē darbību, izseko transportlīdzekļu remontdarbus un palīdz nodrošināt izcilu klientu apkalpošanu.
                    </p>
                </section>

                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">Galvenās funkcijas</h2>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2 text-xl">✓</span>
                            <div>
                                <strong>Transportlīdzekļu pārvaldība:</strong> Uzturiet detalizētu informāciju par visiem transportlīdzekļiem, ieskaitot 
                                valsts reģistrācijas numurus, VIN numurus, marku, modeli, gadu un informāciju par īpašnieku.
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2 text-xl">✓</span>
                            <div>
                                <strong>Darba uzdevumu izsekošana:</strong> Izveidojiet un pārvaldiet darba uzdevumus ar statusa izsekošanu 
                                no diagnostikas līdz pabeigšanai, ieskaitot klientu sūdzības un iekšējās piezīmes.
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2 text-xl">✓</span>
                            <div>
                                <strong>Detaļu un darba pārvaldība:</strong> Sekojiet līdzi darba stundām un izmantotajām detaļām katram darbam, 
                                ar automātiskiem izmaksu aprēķiniem un rēķinu sagatavošanu.
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2 text-xl">✓</span>
                            <div>
                                <strong>Maksājumu apstrāde:</strong> Pārraugiet maksājumu statusu un veidus, nodrošinot precīzu 
                                finanšu uzskaiti katram darba uzdevumam.
                            </div>
                        </li>
                    </ul>
                </section>

                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">Tehnoloģiju kopums</h2>
                    <p className="mb-3">
                        Izstrādāts, izmantojot mūsdienīgas tīmekļa tehnoloģijas veiktspējai, uzticamībai un mērogojamībai:
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
                                <li>• API maršruti</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">Sazinieties ar mums</h2>
                    <p className="mb-4">
                        Ir jautājumi vai nepieciešams atbalsts? Mēs esam šeit, lai palīdzētu!
                    </p>
                    <div className="space-y-2">
                        <p><strong>E-pasts:</strong> support@autorepairshop.com</p>
                        <p><strong>Tālrunis:</strong> (555) 123-4567</p>
                        <p><strong>Darba laiks:</strong> Pirmdiena - Piektdiena, 9:00 - 17:00 EST</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
