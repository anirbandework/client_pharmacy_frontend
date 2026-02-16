import { useState, useEffect } from 'react';
import { superAdminApi } from '../services/adminApi';

export default function AllShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadShops(); }, []);

  const loadShops = async () => {
    try {
      const data = await superAdminApi.getAllShops();
      setShops(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const groupByOrg = () => {
    return shops.reduce((acc, shop) => {
      const org = shop.organization_id || 'No Organization';
      if (!acc[org]) acc[org] = [];
      acc[org].push(shop);
      return acc;
    }, {});
  };

  const groupedShops = groupByOrg();

  if (loading) return <div className="bg-white p-6 rounded-xl shadow-md text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">📊 Read-only view • Total: {shops.length} shops</p>
      </div>

      {Object.entries(groupedShops).map(([orgId, orgShops]) => (
        <div key={orgId} className="bg-white p-4 rounded-xl shadow-md border border-primary-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{orgId}</span>
            <span className="text-sm text-gray-500">({orgShops.length} shop{orgShops.length > 1 ? 's' : ''})</span>
          </h3>
          <div className="grid gap-3">
            {orgShops.map(shop => (
              <div key={shop.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{shop.shop_name}</h4>
                    <p className="text-sm text-gray-500">Code: {shop.shop_code}</p>
                    <p className="text-sm text-gray-600">{shop.address}</p>
                    <p className="text-sm text-gray-600">Phone: {shop.phone}</p>
                    {shop.email && <p className="text-sm text-gray-600">Email: {shop.email}</p>}
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${shop.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {shop.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
