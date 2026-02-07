import React, { useState, useEffect } from 'react'
import { stockAuditAPI } from '../services/stockAudit'
import { Package, Plus, Grid, Edit, Trash2 } from 'lucide-react'

const RackManagement = () => {
  const [racks, setRacks] = useState([])
  const [sections, setSections] = useState([])
  const [showRackForm, setShowRackForm] = useState(false)
  const [showSectionForm, setShowSectionForm] = useState(false)
  const [editingRack, setEditingRack] = useState(null)
  const [editingSection, setEditingSection] = useState(null)
  const [rackData, setRackData] = useState({ rack_number: '', location: '', description: '' })
  const [sectionData, setSectionData] = useState({ rack_id: '', section_name: '', section_code: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [racksRes, sectionsRes] = await Promise.all([
        stockAuditAPI.getRacks(),
        stockAuditAPI.getSections()
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
        await stockAuditAPI.updateRack(editingRack.id, rackData)
      } else {
        await stockAuditAPI.createRack(rackData)
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
      await stockAuditAPI.deleteRack(id)
      fetchData()
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to delete rack')
    }
  }

  const handleSectionSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSection) {
        await stockAuditAPI.updateSection(editingSection.id, sectionData)
      } else {
        await stockAuditAPI.createSection(sectionData)
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
      await stockAuditAPI.deleteSection(id)
      fetchData()
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to delete section')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Racks</h2>
          <button onClick={() => { setShowRackForm(!showRackForm); setEditingRack(null); setRackData({ rack_number: '', location: '', description: '' }); }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
            <Plus className="w-4 h-4" />Add Rack
          </button>
        </div>
        {showRackForm && (
          <form onSubmit={handleRackSubmit} className="mb-4 p-4 bg-gray-50 rounded">
            <div className="grid grid-cols-3 gap-4">
              <input type="text" placeholder="Rack Number" value={rackData.rack_number} onChange={(e) => setRackData({ ...rackData, rack_number: e.target.value })} className="px-3 py-2 border rounded" required />
              <input type="text" placeholder="Location" value={rackData.location} onChange={(e) => setRackData({ ...rackData, location: e.target.value })} className="px-3 py-2 border rounded" required />
              <input type="text" placeholder="Description" value={rackData.description} onChange={(e) => setRackData({ ...rackData, description: e.target.value })} className="px-3 py-2 border rounded" />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{editingRack ? 'Update' : 'Save'}</button>
              <button type="button" onClick={() => { setShowRackForm(false); setEditingRack(null); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            </div>
          </form>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {racks.map((rack) => (
            <div key={rack.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-primary-600" />
                  <div>
                    <h3 className="font-semibold">{rack.rack_number}</h3>
                    <p className="text-sm text-gray-600">{rack.location}</p>
                    {rack.description && <p className="text-xs text-gray-500">{rack.description}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRackEdit(rack)} className="text-blue-600 hover:text-blue-800"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleRackDelete(rack.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sections</h2>
          <button onClick={() => { setShowSectionForm(!showSectionForm); setEditingSection(null); setSectionData({ rack_id: '', section_name: '', section_code: '' }); }} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            <Plus className="w-4 h-4" />Add Section
          </button>
        </div>
        {showSectionForm && (
          <form onSubmit={handleSectionSubmit} className="mb-4 p-4 bg-gray-50 rounded">
            <div className="grid grid-cols-3 gap-4">
              <select value={sectionData.rack_id} onChange={(e) => setSectionData({ ...sectionData, rack_id: e.target.value })} className="px-3 py-2 border rounded" required>
                <option value="">Select Rack</option>
                {racks.map((rack) => (<option key={rack.id} value={rack.id}>{rack.rack_number}</option>))}
              </select>
              <input type="text" placeholder="Section Name" value={sectionData.section_name} onChange={(e) => setSectionData({ ...sectionData, section_name: e.target.value })} className="px-3 py-2 border rounded" required />
              <input type="text" placeholder="Section Code" value={sectionData.section_code} onChange={(e) => setSectionData({ ...sectionData, section_code: e.target.value })} className="px-3 py-2 border rounded" required />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{editingSection ? 'Update' : 'Save'}</button>
              <button type="button" onClick={() => { setShowSectionForm(false); setEditingSection(null); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            </div>
          </form>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {sections.map((section) => (
            <div key={section.id} className="border rounded p-3 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <Grid className="w-5 h-5 text-green-600" />
                <div className="flex gap-1">
                  <button onClick={() => handleSectionEdit(section)} className="text-blue-600 hover:text-blue-800"><Edit className="w-3 h-3" /></button>
                  <button onClick={() => handleSectionDelete(section.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              <p className="font-medium">{section.section_name}</p>
              <p className="text-xs text-gray-500">{section.section_code}</p>
              <p className="text-xs text-gray-400">{racks.find(r => r.id === section.rack_id)?.rack_number}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RackManagement
