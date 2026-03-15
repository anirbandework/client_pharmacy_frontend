import { useState, useEffect } from 'react'
import { adminStockAuditAPI } from '../../services/admin_stock_audit_apis'
import { Package, Grid, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

const AdminRacks = ({ selectedShop }) => {
  const [racks, setRacks] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRacks, setExpandedRacks] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [selectedShop])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [racksRes, sectionsRes] = await Promise.all([
        adminStockAuditAPI.getAdminRacks(),
        adminStockAuditAPI.getAdminSections()
      ])
      let racksData = racksRes.data || []
      let sectionsData = sectionsRes.data || []
      // Client-side filter by shop if selected
      if (selectedShop) {
        racksData = racksData.filter(r => r.shop_id === selectedShop)
        sectionsData = sectionsData.filter(s => s.shop_id === selectedShop)
      }
      setRacks(racksData)
      setSections(sectionsData)
    } catch (error) {
      console.error('Failed to fetch racks:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleRack = (rackId) => {
    const next = new Set(expandedRacks)
    if (next.has(rackId)) next.delete(rackId)
    else next.add(rackId)
    setExpandedRacks(next)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-600 animate-spin" />
        <p className="text-gray-600 dark:text-slate-400 font-medium">Loading racks and sections...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Racks Section */}
      <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Package className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            Racks
          </h2>
          <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">
            {racks.length} {racks.length === 1 ? 'rack' : 'racks'}
          </span>
        </div>

        {racks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
            <Package className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
            <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base">No racks found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {racks.map((rack) => {
              const rackSections = sections.filter(s => s.rack_id === rack.id)
              const isExpanded = expandedRacks.has(rack.id)

              return (
                <div key={rack.id} className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                  <div
                    className="p-4 cursor-pointer hover:bg-purple-100/50 dark:hover:bg-purple-800/20 transition-colors"
                    onClick={() => toggleRack(rack.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                          <Package className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800 dark:text-white text-sm md:text-base">{rack.rack_number}</h3>
                            <span className="px-2 py-0.5 bg-purple-200 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300 text-xs rounded-full font-semibold">
                              {rackSections.length} {rackSections.length === 1 ? 'section' : 'sections'}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400">{rack.location}</p>
                          {rack.description && <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{rack.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-purple-600" /> : <ChevronDown className="w-5 h-5 text-purple-600" />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && rackSections.length > 0 && (
                    <div className="px-4 pb-4 pt-2 bg-white/50 dark:bg-slate-800/40 border-t border-purple-200 dark:border-purple-700/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {rackSections.map((section) => (
                          <div key={section.id} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700/50 rounded-lg p-3 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
                                <Grid className="w-4 h-4 text-green-600" />
                              </div>
                            </div>
                            <p className="font-bold text-gray-800 dark:text-white text-sm">{section.section_name}</p>
                            <p className="text-xs text-gray-600 dark:text-slate-400 font-mono mt-1">{section.section_code}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isExpanded && rackSections.length === 0 && (
                    <div className="px-4 pb-4 pt-2 bg-white/50 dark:bg-slate-800/40 border-t border-purple-200 dark:border-purple-700/50">
                      <p className="text-sm text-gray-500 dark:text-slate-400 text-center py-3">No sections in this rack</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* All Sections Section */}
      <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Grid className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            Sections
          </h2>
          <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">
            {sections.length} {sections.length === 1 ? 'section' : 'sections'}
          </span>
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
            <Grid className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
            <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base">No sections found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sections.map((section) => (
              <div key={section.id} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700/50 rounded-xl p-3 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <Grid className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  </div>
                </div>
                <p className="font-bold text-gray-800 dark:text-white text-sm">{section.section_name}</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 font-mono mt-1">{section.section_code}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">{racks.find(r => r.id === section.rack_id)?.rack_number}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminRacks
