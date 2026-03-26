import os

BASE = r'd:\Capstone\Hopelink\src'

def fix(path, replacements):
    with open(path, encoding='utf-8') as f:
        src = f.read()
    found = 0
    for old, new in replacements:
        if old in src:
            src = src.replace(old, new)
            found += 1
        else:
            print(f'  ✗ NOT FOUND in {os.path.basename(path)}: {repr(old[:60])}')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(src)
    print(f'  ✓ {os.path.basename(path)}: {found}/{len(replacements)} applied')

# ── Shared replacements for BOTH ReportsModal files ───────────────────────────
REPORTS_MODAL_REPLACEMENTS = [
    # Main container
    ('bg-navy-900 border-2 border-yellow-500/20 shadow-2xl rounded-xl flex flex-col',
     'bg-white border-2 border-gray-200 shadow-2xl rounded-xl flex flex-col'),
    # Header/filter borders
    ('border-b-2 border-yellow-500/20 flex-shrink-0',
     'border-b-2 border-gray-200 flex-shrink-0'),
    ('border-b-2 border-yellow-500/20 flex flex-col sm:flex-row',
     'border-b-2 border-gray-200 flex flex-col sm:flex-row'),
    # Header icon
    ('p-2 bg-yellow-500/10 rounded-lg',
     'p-2 bg-blue-50 rounded-lg'),
    ('<AlertTriangle className="h-6 w-6 text-yellow-400" />',
     '<AlertTriangle className="h-6 w-6 text-blue-500" />'),
    # Title / subtitle
    ('<h2 className="text-xl font-bold text-white">User Reports</h2>',
     '<h2 className="text-xl font-bold text-gray-900">User Reports</h2>'),
    ('<p className="text-xs text-yellow-300">Review and manage reported users</p>',
     '<p className="text-xs text-gray-500">Review and manage reported users</p>'),
    # Close button
    ('className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-navy-800 rounded-lg"',
     'className="text-gray-400 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"'),
    # Search icon
    ('<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-400" />',
     '<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />'),
    # Search input
    ('className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"',
     'className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"'),
    # Filter select
    ('className="appearance-none w-full sm:w-48 px-4 py-2 pr-10 bg-navy-800 border border-navy-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer transition-colors"',
     'className="appearance-none w-full sm:w-48 px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"'),
    # Filter icon
    ('<Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-400 pointer-events-none" />',
     '<Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />'),
    # Loading spinner
    ('animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto',
     'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'),
    # Table head
    ('<thead className="bg-navy-800 border-b-2 border-yellow-500/20">',
     '<thead className="bg-gray-50 border-b-2 border-gray-200">'),
    # Table headers
    ('text-left text-xs font-semibold text-yellow-300 uppercase tracking-wider',
     'text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'),
    ('text-center text-xs font-semibold text-yellow-300 uppercase tracking-wider',
     'text-center text-xs font-semibold text-gray-500 uppercase tracking-wider'),
    # Tbody divider
    ('<tbody className="divide-y divide-navy-700">',
     '<tbody className="divide-y divide-gray-200">'),
    # Row hover
    ('className="hover:bg-navy-800/30 transition-colors"',
     'className="hover:bg-gray-50 transition-colors"'),
    # User name buttons
    ('className="text-sm font-semibold text-white truncate hover:text-yellow-400 transition-colors px-2 py-1 rounded-lg hover:bg-blue-600/20 hover:border-blue-500/30 border border-transparent"',
     'className="text-sm font-semibold text-gray-800 truncate hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent"'),
    # Reason text
    ('<div className="text-sm font-medium text-white line-clamp-2">',
     '<div className="text-sm font-medium text-gray-800 line-clamp-2">'),
    # Resolution sub-modal container
    ('className="bg-navy-900 border-2 border-yellow-500/20 shadow-2xl rounded-xl p-6 max-w-md w-full"',
     'className="bg-white border-2 border-gray-200 shadow-2xl rounded-xl p-6 max-w-md w-full"'),
    # Sub-modal FileText icon
    ('<FileText className="h-5 w-5 text-yellow-400" />',
     '<FileText className="h-5 w-5 text-blue-500" />'),
    # Sub-modal title
    ('<h3 className="text-lg font-bold text-white">Resolve Report</h3>',
     '<h3 className="text-lg font-bold text-gray-900">Resolve Report</h3>'),
    # Sub-modal textarea
    ('className="w-full h-32 px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4 resize-none transition-colors"',
     'className="w-full h-32 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none transition-colors"'),
    # Sub-modal cancel button
    ('className="flex-1 px-4 py-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"',
     'className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"'),
    # Profile modal container
    ('className="bg-navy-900 border-2 border-yellow-500/30 shadow-2xl rounded-lg sm:rounded-xl p-3 sm:p-5 max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar"',
     'className="bg-white border-2 border-gray-200 shadow-2xl rounded-lg sm:rounded-xl p-3 sm:p-5 max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar"'),
    # Profile header section border
    ('pb-2 sm:pb-3 border-b-2 border-yellow-500/20',
     'pb-2 sm:pb-3 border-b-2 border-gray-200'),
    # Profile header icon bg
    ('p-1.5 bg-yellow-500/10 rounded-lg flex-shrink-0',
     'p-1.5 bg-blue-50 rounded-lg flex-shrink-0'),
    # Profile header User icon
    ('<User className="h-4 w-4 text-yellow-400" />',
     '<User className="h-4 w-4 text-blue-500" />'),
    # Profile header title
    ('<h3 className="text-base sm:text-lg font-bold text-white truncate">',
     '<h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">'),
    # Profile header close btn
    ('className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-navy-800 rounded-lg flex-shrink-0 ml-2"',
     'className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0 ml-2"'),
    # Loading spinner in profile
    ('animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto',
     'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'),
    # Avatar border
    ('className="h-28 w-28 sm:h-36 sm:w-36 rounded-full overflow-hidden border-2 border-yellow-500 shadow-lg flex items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors"',
     'className="h-28 w-28 sm:h-36 sm:w-36 rounded-full overflow-hidden border-2 border-gray-300 shadow-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"'),
    # Avatar fallback
    ('<div className="h-full w-full bg-navy-700 flex items-center justify-center">',
     '<div className="h-full w-full bg-gray-100 flex items-center justify-center">'),
    ('<User className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-400" />',
     '<User className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400" />'),
    # Profile name
    ('<h4 className="text-white font-bold text-base sm:text-lg mb-1">',
     '<h4 className="text-gray-900 font-bold text-base sm:text-lg mb-1">'),
    # Profile member since date
    ('<span className="text-yellow-400 flex items-center gap-1 whitespace-nowrap">',
     '<span className="text-gray-500 flex items-center gap-1 whitespace-nowrap">'),
    # Profile account type (second occurrence of same pattern)
    # Section cards
    ('className="bg-navy-800/30 rounded-lg p-3 border border-yellow-500/20"',
     'className="bg-gray-50 rounded-lg p-3 border border-gray-200"'),
    # Section h5 headings with icons
    ('<h5 className="text-white font-semibold mb-2 text-sm flex items-center gap-2">',
     '<h5 className="text-gray-900 font-semibold mb-2 text-sm flex items-center gap-2">'),
    # Section icons
    ('<User className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />',
     '<User className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />'),
    ('<Phone className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />',
     '<Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />'),
    ('<MapPin className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />',
     '<MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />'),
    ('<AlertTriangle className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />',
     '<AlertTriangle className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />'),
    ('<Heart className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />',
     '<Heart className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />'),
    ('<Truck className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />',
     '<Truck className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />'),
    ('<Star className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />',
     '<Star className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />'),
    ('<MessageSquare className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />',
     '<MessageSquare className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />'),
    ('<Mail className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />',
     '<Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />'),
    ('<Gift className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />',
     '<Gift className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />'),
    # Field labels
    ('<span className="text-yellow-400 font-medium flex-shrink-0">',
     '<span className="text-gray-500 font-medium flex-shrink-0">'),
    # Field label block
    ('<span className="text-yellow-400 font-medium block mb-1.5 text-xs">',
     '<span className="text-gray-500 font-medium block mb-1.5 text-xs">'),
    # Calendar inline date icon
    ('<Calendar className="h-3.5 w-3.5 flex-shrink-0" />',
     '<Calendar className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />'),
    ('<Building2 className="h-3.5 w-3.5 flex-shrink-0" />',
     '<Building2 className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />'),
    # Website link
    ('className="text-yellow-300 hover:text-yellow-200 break-all flex-1 flex items-center gap-1"',
     'className="text-blue-600 hover:text-blue-700 break-all flex-1 flex items-center gap-1"'),
    # Phone/email links inside Contact Info
    ('className="text-white hover:text-yellow-300 transition-colors break-all"',
     'className="text-gray-800 hover:text-blue-600 transition-colors break-all"'),
    ('className="text-white hover:text-yellow-300 transition-colors break-all flex-1"',
     'className="text-gray-800 hover:text-blue-600 transition-colors break-all flex-1"'),
    # Tags (assistance_needs, skills, delivery types, etc.)
    ('className="bg-navy-700 text-xs px-2 py-1 rounded-full text-yellow-300 border border-yellow-500/30 font-medium whitespace-nowrap flex-shrink-0"',
     'className="bg-blue-50 text-xs px-2 py-1 rounded-full text-blue-700 border border-blue-200 font-medium whitespace-nowrap flex-shrink-0"'),
    ('className="bg-navy-700 text-xs px-2 py-1 rounded-full text-yellow-300 border border-yellow-500/30 font-medium break-words"',
     'className="bg-blue-50 text-xs px-2 py-1 rounded-full text-blue-700 border border-blue-200 font-medium break-words"'),
    # Bio text
    ('<p className={`text-xs sm:text-sm leading-relaxed break-words ${selectedProfile?.bio ? \'text-yellow-200\' : \'text-gray-400 italic\'}`}>',
     '<p className={`text-xs sm:text-sm leading-relaxed break-words ${selectedProfile?.bio ? \'text-gray-700\' : \'text-gray-400 italic\'}`}>'),
    # Delivery notes text
    ('<p className={`text-xs sm:text-sm leading-relaxed break-words ${selectedProfile?.delivery_notes ? \'text-white\' : \'text-gray-400 italic\'}`}>',
     '<p className={`text-xs sm:text-sm leading-relaxed break-words ${selectedProfile?.delivery_notes ? \'text-gray-800\' : \'text-gray-400 italic\'}`}>'),
    # Footer border
    ('className="mt-3 sm:mt-4 pt-3 border-t border-yellow-500/20"',
     'className="mt-3 sm:mt-4 pt-3 border-t border-gray-200"'),
    # Profile image viewer fallback
    ('className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-navy-800 border-4 border-navy-700 flex items-center justify-center mb-4"',
     'className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center mb-4"'),
    ('<User className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-400" />',
     '<User className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400" />'),
]

print('=== ReportsModal (components/ui) ===')
fix(fr'{BASE}\components\ui\ReportsModal.jsx', REPORTS_MODAL_REPLACEMENTS)

print('=== ReportsModal (modules/admin) ===')
fix(fr'{BASE}\modules\admin\components\ReportsModal.jsx', REPORTS_MODAL_REPLACEMENTS)

# ── AttendanceModal ────────────────────────────────────────────────────────────
print('=== AttendanceModal ===')
fix(fr'{BASE}\components\ui\AttendanceModal.jsx', [
    ('relative bg-navy-900 rounded-lg shadow-xl border border-yellow-500/30',
     'relative bg-white rounded-lg shadow-xl border border-gray-200'),
    ('flex items-center justify-between p-6 border-b border-navy-700',
     'flex items-center justify-between p-6 border-b border-gray-200'),
    ('p-2 bg-yellow-400/20 rounded-lg',
     'p-2 bg-blue-50 rounded-lg'),
    ('<Users className="h-5 w-5 text-yellow-400" />',
     '<Users className="h-5 w-5 text-blue-500" />'),
    ('<h2 className="text-xl font-bold text-white">Event Attendance</h2>',
     '<h2 className="text-xl font-bold text-gray-900">Event Attendance</h2>'),
    ('className="p-2 hover:bg-navy-800 rounded-lg transition-colors"',
     'className="p-2 hover:bg-gray-100 rounded-lg transition-colors"'),
    # Stats bar
    ('px-6 py-4 bg-navy-800/50 border-b border-navy-700',
     'px-6 py-4 bg-gray-50 border-b border-gray-200'),
    ('<div className="text-2xl font-bold text-white">{stats.total}</div>',
     '<div className="text-2xl font-bold text-gray-900">{stats.total}</div>'),
    ('<div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>',
     '<div className="text-2xl font-bold text-amber-500">{stats.pending}</div>'),
    # Attendee cards
    ('className="bg-navy-800/50 rounded-lg p-4 border border-navy-700 hover:border-yellow-500/30 transition-colors"',
     'className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"'),
    # Avatar circle in attendee
    ('className="flex-shrink-0 w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center"',
     'className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center"'),
    ('<span className="text-yellow-400 font-semibold text-sm">',
     '<span className="text-blue-500 font-semibold text-sm">'),
    ('<div className="text-white font-medium truncate">',
     '<div className="text-gray-900 font-medium truncate">'),
    # Status buttons – Pending inactive/active
    ("'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40'",
     "'bg-amber-100 text-amber-600 border border-amber-300'"),
    ("'bg-navy-700 text-gray-400 hover:bg-navy-600'",
     "'bg-gray-100 text-gray-500 hover:bg-gray-200'"),
    # Footer
    ('border-t border-navy-700 bg-navy-800/50 flex items-center justify-between',
     'border-t border-gray-200 bg-gray-50 flex items-center justify-between'),
])

# ── CancelEventConfirmationModal ───────────────────────────────────────────────
print('=== CancelEventConfirmationModal ===')
fix(fr'{BASE}\components\ui\CancelEventConfirmationModal.jsx', [
    ('relative bg-navy-900 rounded-lg shadow-xl border border-red-500/30',
     'relative bg-white rounded-lg shadow-xl border border-gray-200'),
    ('flex items-center justify-between p-6 border-b border-navy-700',
     'flex items-center justify-between p-6 border-b border-gray-200'),
    ('<h2 className="text-xl font-bold text-white">Cancel Event Registration</h2>',
     '<h2 className="text-xl font-bold text-gray-900">Cancel Event Registration</h2>'),
    ('className="p-2 hover:bg-navy-800 rounded-lg transition-colors"',
     'className="p-2 hover:bg-gray-100 rounded-lg transition-colors"'),
    ('<h3 className="text-2xl font-bold text-white mb-4">{event.name}</h3>',
     '<h3 className="text-2xl font-bold text-gray-900 mb-4">{event.name}</h3>'),
    ('${status.color} bg-navy-800`', '${status.color} bg-gray-100`'),
    ('className="bg-navy-800/50 rounded-lg p-4 border border-navy-700"',
     'className="bg-gray-50 rounded-lg p-4 border border-gray-200"'),
    ('<h4 className="text-sm font-semibold text-yellow-400 mb-2">Description</h4>',
     '<h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>'),
    ('<Calendar className="h-4 w-4 text-yellow-400" />',
     '<Calendar className="h-4 w-4 text-gray-400" />'),
    ('<h4 className="text-sm font-semibold text-yellow-400">Date</h4>',
     '<h4 className="text-sm font-semibold text-gray-700">Date</h4>'),
    ('<p className="text-white text-sm">{formatDate(event.start_date)}</p>',
     '<p className="text-gray-800 text-sm">{formatDate(event.start_date)}</p>'),
    ('<Clock className="h-4 w-4 text-yellow-400" />',
     '<Clock className="h-4 w-4 text-gray-400" />'),
    ('<h4 className="text-sm font-semibold text-yellow-400">Time</h4>',
     '<h4 className="text-sm font-semibold text-gray-700">Time</h4>'),
    ('<MapPin className="h-4 w-4 text-yellow-400" />',
     '<MapPin className="h-4 w-4 text-gray-400" />'),
    ('<h4 className="text-sm font-semibold text-yellow-400">Location</h4>',
     '<h4 className="text-sm font-semibold text-gray-700">Location</h4>'),
    ('<Users className="h-4 w-4 text-yellow-400" />',
     '<Users className="h-4 w-4 text-gray-400" />'),
    ('<h4 className="text-sm font-semibold text-yellow-400">Participants</h4>',
     '<h4 className="text-sm font-semibold text-gray-700">Participants</h4>'),
    # Footer
    ('border-t border-navy-700 bg-navy-800/50 flex items-center justify-end gap-3',
     'border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3'),
    ('className="px-4 py-2 text-gray-300 hover:text-white transition-colors"',
     'className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"'),
])

# ── DeliveryConfirmationModal ──────────────────────────────────────────────────
print('=== DeliveryConfirmationModal ===')
fix(fr'{BASE}\components\ui\DeliveryConfirmationModal.jsx', [
    ('className="bg-navy-900 border-2 border-yellow-500/30 shadow-2xl rounded-xl p-6 max-w-md w-full"',
     'className="bg-white border-2 border-gray-200 shadow-2xl rounded-xl p-6 max-w-md w-full"'),
    ('mb-6 pb-4 border-b-2 border-yellow-500/20',
     'mb-6 pb-4 border-b-2 border-gray-200'),
    ('p-2 bg-yellow-500/10 rounded-lg',
     'p-2 bg-blue-50 rounded-lg'),
    ('<Truck className="h-6 w-6 text-yellow-400" />',
     '<Truck className="h-6 w-6 text-blue-500" />'),
    ('<h3 className="text-lg font-semibold text-white">Confirm Delivery</h3>',
     '<h3 className="text-lg font-semibold text-gray-900">Confirm Delivery</h3>'),
    ('<p className="text-sm text-yellow-300">',
     '<p className="text-sm text-gray-500">'),
    ('className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-navy-800 rounded-lg"',
     'className="text-gray-400 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"'),
    # Info box
    ('className="bg-navy-800/50 border border-yellow-500/20 rounded-lg p-4 mb-6"',
     'className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6"'),
    ('<User className="h-5 w-5 text-yellow-400" />',
     '<User className="h-5 w-5 text-gray-400" />'),
    ('<span className="text-white font-medium">Volunteer: {data.volunteer_name || \'Unknown\'}</span>',
     '<span className="text-gray-900 font-medium">Volunteer: {data.volunteer_name || \'Unknown\'}</span>'),
    ('<Package className="h-5 w-5 text-yellow-400" />',
     '<Package className="h-5 w-5 text-gray-400" />'),
    ('<span className="text-yellow-300 text-sm">',
     '<span className="text-gray-600 text-sm">'),
    # Labels
    ('<label className="block text-sm font-medium text-yellow-300 mb-2">',
     '<label className="block text-sm font-medium text-gray-700 mb-2">'),
    # Detailed feedback toggle
    ('className="text-sm text-yellow-400 hover:text-yellow-300 underline"',
     'className="text-sm text-blue-600 hover:text-blue-700 underline"'),
    # Detailed section bg
    ('className="space-y-4 bg-navy-800/50 p-4 rounded-lg border border-yellow-500/20"',
     'className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200"'),
    # Feedback textarea
    ('className="w-full px-3 py-2 bg-navy-800 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-400/50 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 resize-none"',
     'className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"'),
])

# ── DirectDeliveryManagementModal ─────────────────────────────────────────────
print('=== DirectDeliveryManagementModal ===')
fix(fr'{BASE}\components\ui\DirectDeliveryManagementModal.jsx', [
    ('className="bg-navy-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"',
     'className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"'),
    ('flex items-center justify-between p-6 border-b border-navy-700',
     'flex items-center justify-between p-6 border-b border-gray-200'),
    ('<h3 className="text-xl font-bold text-white">Direct Delivery Management</h3>',
     '<h3 className="text-xl font-bold text-gray-900">Direct Delivery Management</h3>'),
    ('className="p-2 hover:bg-navy-700 rounded-lg transition-colors"',
     'className="p-2 hover:bg-gray-100 rounded-lg transition-colors"'),
    ('className="bg-navy-800/50 rounded-lg p-4"',
     'className="bg-gray-50 rounded-lg p-4 border border-gray-200"'),
    ('<h4 className="text-md font-semibold text-white mb-3">',
     '<h4 className="text-md font-semibold text-gray-900 mb-3">'),
    ('<p className="text-white">{donation?.donation?.donor?.name || \'Unknown\'}</p>',
     '<p className="text-gray-800">{donation?.donation?.donor?.name || \'Unknown\'}</p>'),
    ('<p className="text-white">{donation?.recipient?.name || \'Unknown\'}</p>',
     '<p className="text-gray-800">{donation?.recipient?.name || \'Unknown\'}</p>'),
    ('<p className="text-white">{directDelivery.delivery_address}</p>',
     '<p className="text-gray-800">{directDelivery.delivery_address}</p>'),
    ('<p className="text-white">{directDelivery.delivery_instructions}</p>',
     '<p className="text-gray-800">{directDelivery.delivery_instructions}</p>'),
    # Inner confirm dialog
    ('className="bg-navy-800 rounded-lg p-6 w-full max-w-md mx-4"',
     'className="bg-white rounded-lg p-6 w-full max-w-md mx-4 border border-gray-200"'),
    ('<h4 className="text-lg font-semibold text-white mb-4">',
     '<h4 className="text-lg font-semibold text-gray-900 mb-4">'),
])

# ── ReportUserModal ────────────────────────────────────────────────────────────
print('=== ReportUserModal ===')
fix(fr'{BASE}\components\ui\ReportUserModal.jsx', [
    ('className="relative w-full max-w-md bg-navy-900 rounded-lg border border-red-500/30 shadow-2xl"',
     'className="relative w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-2xl"'),
    ('flex items-center justify-between px-6 py-4 bg-navy-800 border-b border-red-500/30',
     'flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200'),
    ('<h2 className="text-lg font-bold text-white">Report User</h2>',
     '<h2 className="text-lg font-bold text-gray-900">Report User</h2>'),
    ('className="p-2 rounded-lg hover:bg-navy-700 text-gray-400 hover:text-white transition-colors"',
     'className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"'),
    ('className="bg-navy-800/50 rounded-lg p-4 border border-navy-700"',
     'className="bg-gray-50 rounded-lg p-4 border border-gray-200"'),
    ('<div className="text-sm font-medium text-white">',
     '<div className="text-sm font-medium text-gray-900">'),
    ('<label className="block text-sm font-medium text-white mb-2">',
     '<label className="block text-sm font-medium text-gray-900 mb-2">'),
    ('className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"',
     'className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"'),
    ('className="w-full h-32 px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"',
     'className="w-full h-32 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"'),
    # Notice box
    ('<AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />',
     '<AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />'),
    ('<p className="text-xs text-yellow-300">',
     '<p className="text-xs text-amber-700">'),
    # Cancel button
    ('className="flex-1 px-4 py-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"',
     'className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"'),
])

# ── TermsModal (both versions) ────────────────────────────────────────────────
TERMS_MODAL_REPLACEMENTS = [
    ('bg-navy-900 border-2 border-yellow-500/30',
     'bg-white border-2 border-gray-200'),
    ('<ScrollText className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />',
     '<ScrollText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />'),
    ('<h3 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">',
     '<h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">'),
    ('className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-navy-800 rounded-lg flex-shrink-0"',
     'className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"'),
    ('<p className="text-yellow-300 text-xs sm:text-sm">',
     '<p className="text-gray-500 text-xs sm:text-sm">'),
    # Cancel/close button at footer
    ('className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium border border-gray-600 text-gray-300 bg-navy-800 hover:bg-navy-700 rounded-lg transition-colors"',
     'className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 rounded-lg transition-colors"'),
]

print('=== TermsModal (modules/legal) ===')
fix(fr'{BASE}\modules\legal\components\TermsModal.jsx', TERMS_MODAL_REPLACEMENTS)
print('=== TermsModal (components/ui) ===')
fix(fr'{BASE}\components\ui\TermsModal.jsx', TERMS_MODAL_REPLACEMENTS)

# ── RoleSelectionModal (both versions) ───────────────────────────────────────
ROLE_MODAL_REPLACEMENTS = [
    ('<h2 className="text-xl font-bold text-white">Choose Your Role</h2>',
     '<h2 className="text-xl font-bold text-gray-900">Choose Your Role</h2>'),
    ('<IconComponent className="h-7 w-7 text-yellow-400 mr-4 flex-shrink-0" />',
     '<IconComponent className="h-7 w-7 text-blue-500 mr-4 flex-shrink-0" />'),
    ('<h3 className="text-base font-semibold text-white">{role.label}</h3>',
     '<h3 className="text-base font-semibold text-gray-900">{role.label}</h3>'),
    # Confirm button
    ('className="px-6 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-600"',
     'className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"'),
]

print('=== RoleSelectionModal (modules/auth) ===')
fix(fr'{BASE}\modules\auth\components\RoleSelectionModal.jsx', ROLE_MODAL_REPLACEMENTS)
print('=== RoleSelectionModal (components/ui) ===')
fix(fr'{BASE}\components\ui\RoleSelectionModal.jsx', ROLE_MODAL_REPLACEMENTS)

# ── CaptchaModal ──────────────────────────────────────────────────────────────
print('=== CaptchaModal ===')
fix(fr'{BASE}\modules\auth\components\CaptchaModal.jsx', [
    ('<h3 className="text-lg font-semibold text-white">{title}</h3>',
     '<h3 className="text-lg font-semibold text-gray-900">{title}</h3>'),
    ('className="text-white/80 hover:text-white"',
     'className="text-gray-500 hover:text-gray-800"'),
])

# ── WorkflowGuideModal (both versions) ───────────────────────────────────────
WORKFLOW_REPLACEMENTS = [
    ('<Info className="h-6 w-6 text-yellow-400" />',
     '<Info className="h-6 w-6 text-blue-500" />'),
    ('<h3 className="text-lg sm:text-xl font-bold text-white">Workflow Guide</h3>',
     '<h3 className="text-lg sm:text-xl font-bold text-gray-900">Workflow Guide</h3>'),
    ('<p className="text-xs text-yellow-300/80 mt-0.5">',
     '<p className="text-xs text-gray-500 mt-0.5">'),
    # Close button
    ('className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"',
     'className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"'),
    ('<h4 className="text-base sm:text-lg font-semibold text-white mb-3">Complete Workflow</h4>',
     '<h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Complete Workflow</h4>'),
    ('className="bg-navy-800/30 rounded-xl p-4 sm:p-5 border border-navy-700/50"',
     'className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200"'),
    ('<h4 className="text-base sm:text-lg font-semibold text-white mb-3">Select Status to Learn More</h4>',
     '<h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Select Status to Learn More</h4>'),
    # Inactive status buttons
    ("'bg-navy-800/50 text-gray-300 hover:bg-navy-700/70 border border-navy-700'",
     "'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"),
]

print('=== WorkflowGuideModal (components/ui) ===')
fix(fr'{BASE}\components\ui\WorkflowGuideModal.jsx', WORKFLOW_REPLACEMENTS)
print('=== WorkflowGuideModal (shared) ===')
fix(fr'{BASE}\shared\components\ui\WorkflowGuideModal.jsx', WORKFLOW_REPLACEMENTS)

print('\nAll done!')
