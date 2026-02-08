import React from 'react';
import {
    Search,
    LayoutGrid,
    List as ListIcon,
    Filter,
    ArrowUpDown,
    ChevronDown
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

const DriveHeader = ({
    title,
    breadcrumbs,
    onNavigate,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterType,
    setFilterType
}) => {
    return (
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
            <div className="flex flex-col gap-4">
                {/* Top Row: Title/Breadcrumbs & Search */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <h1 className="text-xl font-bold text-slate-800 shrink-0 hidden md:block">
                            {title || 'My Drive'}
                        </h1>
                        <div className="hidden md:block w-px h-6 bg-slate-300 mx-2"></div>
                        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
                    </div>

                    <div className="flex items-center gap-3 flex-1 justify-end max-w-xl">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search in Drive..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white border text-sm border-transparent focus:border-indigo-500 rounded-xl transition-all outline-none shadow-sm focus:shadow-md focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Controls (Sort, Filter, View) */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Sort Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                                <ArrowUpDown size={16} />
                                <span>Sort by: {sortBy === 'name' ? 'Name' : sortBy === 'date' ? 'Date' : 'Size'}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>

                            {/* Dropdown Menu (Implementation needed or use a popover library) */}
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden hidden group-hover:block transition-all z-20">
                                <div className="p-1">
                                    {[
                                        { label: 'Name', value: 'name' },
                                        { label: 'Date Modified', value: 'date' },
                                        { label: 'File Size', value: 'size' }
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setSortBy(opt.value)}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between ${sortBy === opt.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-700'}`}
                                        >
                                            {opt.label}
                                            {sortBy === opt.value && (
                                                <span className="text-xs font-semibold">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </button>
                                    ))}
                                    <div className="h-px bg-slate-100 my-1"></div>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                                    >
                                        <ArrowUpDown size={14} />
                                        {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filter Dropdown */}
                        <div className="relative group">
                            <button className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border border-transparent 
                                ${filterType !== 'all' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-200'}`}>
                                <Filter size={16} />
                                <span>{filterType === 'all' ? 'Type' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
                                <ChevronDown size={14} className={filterType !== 'all' ? 'text-indigo-400' : 'text-slate-400'} />
                            </button>

                            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden hidden group-hover:block transition-all z-20">
                                <div className="p-1">
                                    {[
                                        { label: 'All Files', value: 'all' },
                                        { label: 'Folders', value: 'folder' },
                                        { label: 'Documents', value: 'document' },
                                        { label: 'Images', value: 'image' }
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setFilterType(opt.value)}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between ${filterType === opt.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-700'}`}
                                        >
                                            {opt.label}
                                            {filterType === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
                            title="List View"
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriveHeader;
