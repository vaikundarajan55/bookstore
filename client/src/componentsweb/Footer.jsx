
export default function Footer(){
  return ( 
    <footer className="bg-white border-t p-8">
        <div className="grid md:grid-cols-4 gap-6">

          <div>
            <h3 className="font-bold text-lg mb-2">
              Folio
            </h3>

            <p className="text-gray-500">
              Every great story deserves a great reader.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              Discover
            </h4>

            <ul className="space-y-2">
              <li>New Arrivals</li>
              <li>Bestsellers</li>
              <li>Staff Picks</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              Account
            </h4>

            <ul className="space-y-2">
              <li>My Library</li>
              <li>Wishlist</li>
              <li>Orders</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              Company
            </h4>

            <ul className="space-y-2">
              <li>About Us</li>
              <li>Blog</li>
              <li>Careers</li>
            </ul>
          </div>

        </div>

        <div className="border-t mt-8 pt-4 text-center text-gray-500 text-sm">
          © 2026 Folio Books Ltd. All rights reserved.
        </div>
    </footer>
  )  
}