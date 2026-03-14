import React, { useState, useEffect } from 'react'
import { staffStockAuditAPI } from '../../services/staff_stock_audit_apis'
import { Package, Plus, Grid, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

const RackManagement = () => {
  const [racks, setRacks] = useState([])
  const [sections, setSections] = useState([])
  const [showRackForm, setShowRackForm] = useState(false)
  const [showSectionForm, setShowSectionForm] = useState(false)
  const [editingRack, setEditingRack] = useState(null)
  const [editingSection, setEditingSection] = useState(null)
  const [rackData, setRackData] = useState({ rack_number: '', location: '', description: '' })
  const [sectionData, setSectionData] = useState({ rack_id: '', section_name: '', section_code: '' })
  const [expandedRacks, setExpandedRacks] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [racksRes, sectionsRes] = await Promise.all([
        staffStockAuditAPI.getRacks(),
        staffStockAuditAPI.getSections()
      ])
      setRacks(racksRes.data)
      setSections(sectionsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleRackSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingRack) {
        await staffStockAuditAPI.updateRack(editingRack.id, rackData)
      } else {
        await staffStockAuditAPI.createRack(rackData)
      }
      setRackData({ rack_number: '', location: '', description: '' })
      setShowRackForm(false)
      setEditingRack(null)
      fetchData()
    } catch (error) {
      console.error('Failed to save rack:', error)
    }
  }

  const handleRackEdit = (rack) => {
    setEditingRack(rack)
    setRackData({ rack_number: rack.rack_number, location: rack.location, description: rack.description })
    setShowRackForm(true)
  }

  const handleRackDelete = async (id) => {
    if (!confirm('Delete this rack?')) return
    try {
      await staffStockAuditAPI.deleteRack(id)
      fetchData()
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to delete rack')
    }
  }

  const handleSectionSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSection) {
        await staffStockAuditAPI.updateSection(editingSection.id, sectionData)
      } else {
        await staffStockAuditAPI.createSection(sectionData)
      }
      setSectionData({ rack_id: '', section_name: '', section_code: '' })
      setShowSectionForm(false)
      setEditingSection(null)
      fetchData()
    } catch (error) {
      console.error('Failed to save section:', error)
    }
  }

  const handleSectionEdit = (section) => {
    setEditingSection(section)
    setSectionData({ rack_id: section.rack_id, section_name: section.section_name, section_code: section.section_code })
    setShowSectionForm(true)
  }

  const handleSectionDelete = async (id) => {
    if (!confirm('Delete this section?')) return
    try {
      await staffStockAuditAPI.deleteSection(id)
      fetchData()
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to delete section')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            Racks
          </h2>
          <button onClick={() => { setShowRackForm(!showRackForm); setEditingRack(null); setRackData({ rack_number: '', location: '', description: '' }); }} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all text-sm md:text-base">
            <Plus className="w-4 h-4" />Add Rack
          </button>
        </div>
        {showRackForm && (
          <form onSubmit={handleRackSubmit} className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Rack Number</label>
                <input type="text" placeholder="e.g., R-101" value={rackData.rack_number} onChange={(e) => setRackData({ ...rackData, rack_number: e.target.value })} className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" required />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" placeholder="e.g., Ground Floor" value={rackData.location} onChange={(e) => setRackData({ ...rackData, location: e.target.value })} className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" required />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" placeholder="e.g., Main storage area" value={rackData.description} onChange={(e) => setRackData({ ...rackData, description: e.target.value })} className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all text-sm md:text-base">{editingRack ? 'Update' : 'Save'}</button>
              <button type="button" onClick={() => { setShowRackForm(false); setEditingRack(null); }} className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base">Cancel</button>
            </div>
          </form>
        )}
        <div className="space-y-3">
          {racks.map((rack) => {
            const rackSections = sections.filter(s => s.rack_id === rack.id)
            const isExpanded = expandedRacks.has(rack.id)
            
            return (
              <div key={rack.id} className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                <div 
                  className="p-4 cursor-pointer hover:bg-purple-100/50 transition-colors"
                  onClick={() => {
                    const newExpanded = new Set(expandedRacks)
                    if (isExpanded) {
                      newExpanded.delete(rack.id)
                    } else {
                      newExpanded.add(rack.id)
                    }
                    setExpandedRacks(newExpanded)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Package className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-800 text-sm md:text-base">{rack.rack_number}</h3>
                          <span className="px-2 py-0.5 bg-purple-200 text-purple-700 text-xs rounded-full font-semibold">
                            {rackSections.length} {rackSections.length === 1 ? 'section' : 'sections'}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600">{rack.location}</p>
                        {rack.description && <p className="text-xs text-gray-500 mt-1">{rack.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRackEdit(rack); }} 
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRackDelete(rack.id); }} 
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-purple-600" /> : <ChevronDown className="w-5 h-5 text-purple-600" />}
                    </div>
                  </div>
                </div>
                
                {isExpanded && rackSections.length > 0 && (
                  <div className="px-4 pb-4 pt-2 bg-white/50 border-t border-purple-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {rackSections.map((section) => (
                        <div key={section.id} className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-3 hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <div className="p-1.5 bg-green-100 rounded-lg">
                              <Grid className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => handleSectionEdit(section)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><Edit className="w-3 h-3" /></button>
                              <button onClick={() => handleSectionDelete(section.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          </div>
                          <p className="font-bold text-gray-800 text-sm">{section.section_name}</p>
                          <p className="text-xs text-gray-600 font-mono mt-1">{section.section_code}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {isExpanded && rackSections.length === 0 && (
                  <div className="px-4 pb-4 pt-2 bg-white/50 border-t border-purple-200">
                    <p className="text-sm text-gray-500 text-center py-3">No sections in this rack</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Grid className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            Sections
          </h2>
          <button onClick={() => { setShowSectionForm(!showSectionForm); setEditingSection(null); setSectionData({ rack_id: '', section_name: '', section_code: '' }); }} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all text-sm md:text-base">
            <Plus className="w-4 h-4" />Add Section
          </button>
        </div>
        {showSectionForm && (
          <form onSubmit={handleSectionSubmit} className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Select Rack</label>
                <select value={sectionData.rack_id} onChange={(e) => setSectionData({ ...sectionData, rack_id: e.target.value })} className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" required>
                  <option value="">Choose a rack</option>
                  {racks.map((rack) => (<option key={rack.id} value={rack.id}>{rack.rack_number}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Section Name</label>
                <input type="text" placeholder="e.g., Shelf A" value={sectionData.section_name} onChange={(e) => setSectionData({ ...sectionData, section_name: e.target.value })} className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" required />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Section Code</label>
                <input type="text" placeholder="e.g., S-A1" value={sectionData.section_code} onChange={(e) => setSectionData({ ...sectionData, section_code: e.target.value })} className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" required />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all text-sm md:text-base">{editingSection ? 'Update' : 'Save'}</button>
              <button type="button" onClick={() => { setShowSectionForm(false); setEditingSection(null); }} className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base">Cancel</button>
            </div>
          </form>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sections.map((section) => (
            <div key={section.id} className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-3 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <Grid className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleSectionEdit(section)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><Edit className="w-3 h-3" /></button>
                  <button onClick={() => handleSectionDelete(section.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              <p className="font-bold text-gray-800 text-sm">{section.section_name}</p>
              <p className="text-xs text-gray-600 font-mono mt-1">{section.section_code}</p>
              <p className="text-xs text-purple-600 font-semibold mt-1">{racks.find(r => r.id === section.rack_id)?.rack_number}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RackManagement
