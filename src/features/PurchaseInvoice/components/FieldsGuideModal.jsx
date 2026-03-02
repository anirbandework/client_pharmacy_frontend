import React, { useState, useEffect } from 'react'
import { Info, X, FileText, Package, DollarSign, Calendar, CheckCircle, AlertCircle, Download, Upload } from 'lucide-react'
import { purchaseInvoiceAPI } from '../services/api'

const FieldsGuideModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchGuide = async () => {
    setLoading(true)
    try {
      const response = await purchaseInvoiceAPI.getFieldsGuide()
      setContent(response.data.content)
    } catch (error) {
      console.error('Failed to load fields guide:', error)
      setContent('# Error\n\nFailed to load fields guide. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    if (!content) {
      fetchGuide()
    }
  }

  // Enhanced markdown renderer with table support
  const renderMarkdown = (markdown) => {
    if (!markdown) return null
    
    const lines = markdown.split('\n')
    const elements = []
    let i = 0
    let inTable = false
    let tableRows = []
    
    while (i < lines.length) {
      const line = lines[i]
      
      // Table detection
      if (line.startsWith('|')) {
        if (!inTable) {
          inTable = true
          tableRows = []
        }
        tableRows.push(line)
        i++
        continue
      } else if (inTable) {
        // End of table, render it
        elements.push(renderTable(tableRows, elements.length))
        inTable = false
        tableRows = []
      }
      
      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-3xl font-bold text-gray-800 mb-4 mt-6 flex items-center gap-2"><FileText className="w-8 h-8 text-blue-600" />{line.slice(2)}</h1>)
      } else if (line.startsWith('## ')) {
        const text = line.slice(3).replace(/📋|🏢|📦|🎯|📊|✅|🔧|💡|📞/g, '').trim()
        elements.push(<h2 key={i} className="text-2xl font-bold text-gray-700 mb-3 mt-5 border-b-2 border-blue-200 pb-2 flex items-center gap-2"><Package className="w-6 h-6 text-blue-600" />{text}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-xl font-semibold text-gray-700 mb-2 mt-4">{line.slice(4)}</h3>)
      } else if (line.startsWith('**') && line.endsWith(':**')) {
        elements.push(<h4 key={i} className="text-lg font-semibold text-gray-800 mb-2 mt-3">{line.replace(/\*\*/g, '')}</h4>)
      } else if (line.startsWith('**') && line.includes(':**')) {
        // Handle bold text with colon in middle of line
        const text = line.replace(/\*\*/g, '')
        elements.push(<p key={i} className="mb-2 text-gray-700 font-semibold">{text}</p>)
      } else if (line.startsWith('- ')) {
        const text = line.slice(2)
        if (text.includes('**')) {
          const parts = text.split('**')
          elements.push(
            <li key={i} className="ml-6 mb-1 text-gray-700">
              {parts.map((part, idx) => idx % 2 === 1 ? <strong key={idx} className="font-semibold text-blue-700">{part}</strong> : part)}
            </li>
          )
        } else {
          elements.push(<li key={i} className="ml-6 mb-1 text-gray-700">{text}</li>)
        }
      } else if (line === '---') {
        elements.push(<hr key={i} className="my-6 border-gray-300" />)
      } else if (line.trim() === '') {
        elements.push(<br key={i} />)
      } else if (line.startsWith('```')) {
        // Skip code block markers
      } else if (line.includes('**')) {
        const parts = line.split('**')
        elements.push(
          <p key={i} className="mb-2 text-gray-700">
            {parts.map((part, idx) => idx % 2 === 1 ? <strong key={idx} className="font-semibold">{part}</strong> : part)}
          </p>
        )
      } else if (line.trim()) {
        elements.push(<p key={i} className="mb-2 text-gray-700">{line}</p>)
      }
      
      i++
    }
    
    // Render any remaining table
    if (inTable && tableRows.length > 0) {
      elements.push(renderTable(tableRows, elements.length))
    }
    
    return elements
  }
  
  const renderTable = (rows, key) => {
    if (rows.length < 2) return null
    
    const parseRow = (row) => row.split('|').filter(cell => cell.trim()).map(cell => cell.trim().replace(/\*\*/g, ''))
    
    const headers = parseRow(rows[0])
    const dataRows = rows.slice(2).map(parseRow) // Skip header separator
    
    return (
      <div key={key} className="overflow-x-auto my-4 border border-gray-300 rounded-lg">
        <table className="min-w-full">
          <thead className="bg-blue-50">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {dataRows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    {cell.includes('✅') ? <CheckCircle className="w-4 h-4 text-green-600 inline" /> : 
                     cell.includes('❌') ? <X className="w-4 h-4 text-red-600 inline" /> : 
                     cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Invoice Fields Guide - Click to learn about all invoice fields"
      >
        <Info className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 md:p-6 flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <Info className="w-6 h-6" />
                Invoice Fields Guide
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-2xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-80px)] bg-gray-50">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading guide...</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  {renderMarkdown(content)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FieldsGuideModal
