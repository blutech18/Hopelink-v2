import re

def fix_file(path, replacements):
    with open(path, encoding='utf-8') as f:
        src = f.read()
    found = 0
    for old, new in replacements:
        if old in src:
            src = src.replace(old, new)
            found += 1
        else:
            print(f'  ✗ NOT FOUND: {old[:70]}')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(src)
    print(f'  ✓ {found}/{len(replacements)} replacements applied\n')

# ── JoinEventConfirmationModal ────────────────────────────────────────────────
print('=== JoinEventConfirmationModal ===')
fix_file(
    r'd:\Capstone\Hopelink\src\modules\events\components\JoinEventConfirmationModal.jsx',
    [
        ('relative bg-navy-900 rounded-lg shadow-xl border border-yellow-500/30 w-full max-w-2xl',
         'relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-2xl'),
        ('border-b border-navy-700', 'border-b border-gray-200'),
        ('p-2 bg-yellow-400/20 rounded-lg', 'p-2 bg-blue-50 rounded-lg'),
        ('className="h-5 w-5 text-yellow-400" />\n              </div>\n              <div>\n                <h2 className="text-xl font-bold text-white">Confirm Event Registration</h2>',
         'className="h-5 w-5 text-blue-500" />\n              </div>\n              <div>\n                <h2 className="text-xl font-bold text-gray-900">Confirm Event Registration</h2>'),
        ('p-2 hover:bg-navy-800 rounded-lg transition-colors',
         'p-2 hover:bg-gray-100 rounded-lg transition-colors'),
        ('border-2 border-yellow-500/30">\n                <img', 'border-2 border-gray-200">\n                <img'),
        ('<h3 className="text-2xl font-bold text-white mb-4">{event.name}</h3>',
         '<h3 className="text-2xl font-bold text-gray-900 mb-4">{event.name}</h3>'),
        ('${status.color} bg-navy-800`', '${status.color} bg-gray-100`'),
        ('bg-navy-800/50 rounded-lg p-4 border border-navy-700',
         'bg-gray-50 rounded-lg p-4 border border-gray-200'),
        ('<h4 className="text-sm font-semibold text-yellow-400 mb-2">Description</h4>',
         '<h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>'),
        ('<p className="text-gray-300 text-sm leading-relaxed">',
         '<p className="text-gray-600 text-sm leading-relaxed">'),
        ('<Calendar className="h-4 w-4 text-yellow-400" />\n                    <h4 className="text-sm font-semibold text-yellow-400">Date</h4>',
         '<Calendar className="h-4 w-4 text-gray-500" />\n                    <h4 className="text-sm font-semibold text-gray-700">Date</h4>'),
        ('<p className="text-white text-sm">{formatDate(event.start_date)}</p>',
         '<p className="text-gray-800 text-sm">{formatDate(event.start_date)}</p>'),
        ('<Clock className="h-4 w-4 text-yellow-400" />\n                    <h4 className="text-sm font-semibold text-yellow-400">Time</h4>',
         '<Clock className="h-4 w-4 text-gray-500" />\n                    <h4 className="text-sm font-semibold text-gray-700">Time</h4>'),
        ('<p className="text-white text-sm">\n                    {formatTime(event.start_date)}',
         '<p className="text-gray-800 text-sm">\n                    {formatTime(event.start_date)}'),
        ('<MapPin className="h-4 w-4 text-yellow-400" />\n                    <h4 className="text-sm font-semibold text-yellow-400">Location</h4>',
         '<MapPin className="h-4 w-4 text-gray-500" />\n                    <h4 className="text-sm font-semibold text-gray-700">Location</h4>'),
        ('<p className="text-white text-sm">{event.location}</p>',
         '<p className="text-gray-800 text-sm">{event.location}</p>'),
        ('<Users className="h-4 w-4 text-yellow-400" />\n                    <h4 className="text-sm font-semibold text-yellow-400">Participants</h4>',
         '<Users className="h-4 w-4 text-gray-500" />\n                    <h4 className="text-sm font-semibold text-gray-700">Participants</h4>'),
        ('<p className="text-white text-sm">\n                      {currentParticipants}',
         '<p className="text-gray-800 text-sm">\n                      {currentParticipants}'),
        ('w-full bg-navy-700 rounded-full h-2', 'w-full bg-gray-200 rounded-full h-2'),
        ('className="h-full bg-yellow-400 transition-all"', 'className="h-full bg-blue-500 transition-all"'),
        ('bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4',
         'bg-amber-50 border border-amber-200 rounded-lg p-4'),
        ('<AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />',
         '<AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />'),
        ('<h4 className="text-sm font-semibold text-yellow-400 mb-1">Important Notice</h4>',
         '<h4 className="text-sm font-semibold text-amber-700 mb-1">Important Notice</h4>'),
        ('<p className="text-xs text-gray-300 leading-relaxed">',
         '<p className="text-xs text-gray-600 leading-relaxed">'),
        ('border-t border-navy-700 bg-navy-800/50 flex items-center justify-end gap-3',
         'border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3'),
        ('className="px-4 py-2 text-gray-300 hover:text-white transition-colors"',
         'className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"'),
    ]
)

# ── CreateEventModal ──────────────────────────────────────────────────────────
print('=== CreateEventModal ===')
fix_file(
    r'd:\Capstone\Hopelink\src\modules\events\components\CreateEventModal.jsx',
    [
        ('relative bg-navy-800 rounded-lg shadow-xl border border-navy-700 w-full max-w-4xl',
         'relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-4xl'),
        ('flex items-center justify-between p-4 sm:p-6 border-b border-navy-700',
         'flex items-center justify-between p-4 sm:p-6 border-b border-gray-200'),
        ('p-2 bg-navy-700 rounded-lg flex-shrink-0',
         'p-2 bg-blue-50 rounded-lg flex-shrink-0'),
        ('<Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300" />',
         '<Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />'),
        ('<h2 className="text-lg sm:text-xl font-bold text-white">',
         '<h2 className="text-lg sm:text-xl font-bold text-gray-900">'),
        ('<p className="text-yellow-300 text-xs sm:text-sm hidden sm:block">',
         '<p className="text-gray-500 text-xs sm:text-sm hidden sm:block">'),
        ('className="p-2 text-yellow-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors flex-shrink-0"',
         'className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"'),
        # Form labels text-white → text-gray-900
        ('<label className="block text-white font-medium mb-2">\n                  <Type', '<label className="block text-gray-900 font-medium mb-2">\n                  <Type'),
        ('<label className="block text-white font-medium mb-2">\n                  <FileText', '<label className="block text-gray-900 font-medium mb-2">\n                  <FileText'),
        ('<label className="block text-white font-medium mb-2">Event Type *</label>', '<label className="block text-gray-900 font-medium mb-2">Event Type *</label>'),
        ('<label className="block text-white font-medium mb-2">\n                  <Users className="h-4 w-4 inline mr-2" />\n                  Max Participants', '<label className="block text-gray-900 font-medium mb-2">\n                  <Users className="h-4 w-4 inline mr-2" />\n                  Max Participants'),
        ('<label className="block text-white font-medium mb-2">\n                  <MapPin', '<label className="block text-gray-900 font-medium mb-2">\n                  <MapPin'),
        ('<label className="block text-white font-medium mb-2">\n                  <ImageIcon', '<label className="block text-gray-900 font-medium mb-2">\n                  <ImageIcon'),
        ('<label className="block text-white font-medium">\n                  <Package className="h-4 w-4 inline mr-2" />\n                  Donation Needs', '<label className="block text-gray-900 font-medium">\n                  <Package className="h-4 w-4 inline mr-2" />\n                  Donation Needs'),
        ('<label className="block text-white font-medium">\n                  <Clock className="h-4 w-4 inline mr-2" />\n                  Event Schedule', '<label className="block text-gray-900 font-medium">\n                  <Clock className="h-4 w-4 inline mr-2" />\n                  Event Schedule'),
        ('<label className="block text-white font-medium">\n                  <CheckCircle', '<label className="block text-gray-900 font-medium">\n                  <CheckCircle'),
        ('<label className="block text-white font-medium">\n                  <Package className="h-4 w-4 inline mr-2" />\n                  What to Bring', '<label className="block text-gray-900 font-medium">\n                  <Package className="h-4 w-4 inline mr-2" />\n                  What to Bring'),
        ('<label className="block text-white font-medium">\n                <Users className="h-4 w-4 inline mr-2" />\n                Contact Information', '<label className="block text-gray-900 font-medium">\n                <Users className="h-4 w-4 inline mr-2" />\n                Contact Information'),
        # Main inputs (bg-navy-800 border-navy-700)
        ('bg-navy-800 border border-navy-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500',
         'bg-white border border-gray-200 rounded-lg text-gray-900 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'),
        # Location button
        ('bg-yellow-400 text-navy-900 rounded-lg hover:bg-yellow-500 transition-all active:scale-95 flex items-center justify-center gap-2 font-medium text-sm sm:text-base flex-shrink-0',
         'bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 font-medium text-sm sm:text-base flex-shrink-0'),
        # Image upload info text
        ('<p className="text-yellow-400 text-xs sm:text-sm mb-3">',
         '<p className="text-gray-500 text-xs sm:text-sm mb-3">'),
        # Image border
        ('border border-navy-700"\n                    />', 'border border-gray-200"\n                    />'),
        # Image upload dashed border
        ('border-2 border-dashed border-navy-700 rounded-lg p-8',
         'border-2 border-dashed border-gray-200 rounded-lg p-8'),
        ('<Upload className="h-12 w-12 text-yellow-500 mx-auto mb-4" />',
         '<Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />'),
        ('<p className="text-yellow-400 text-xs sm:text-sm">\n                      Drop an image', '<p className="text-gray-500 text-xs sm:text-sm">\n                      Drop an image'),
        ('<p className="text-yellow-500 text-xs mt-1">', '<p className="text-gray-400 text-xs mt-1">'),
        # Date/Time calendar icon inline
        ('<Calendar className="h-4 w-4 inline mr-2 text-yellow-400" />', '<Calendar className="h-4 w-4 inline mr-2 text-gray-400" />'),
        ('<Clock className="h-4 w-4 inline mr-2 text-yellow-400" />', '<Clock className="h-4 w-4 inline mr-2 text-gray-400" />'),
        # Add buttons (from-yellow-600)
        ('px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white rounded-lg font-medium transition-all active:scale-95 flex items-center gap-2 shadow-md',
         'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all active:scale-95 flex items-center gap-2 shadow-md'),
        # Empty states
        ('text-center py-8 text-yellow-400 bg-navy-800 rounded-lg border border-navy-700',
         'text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200'),
        ('<Package className="h-12 w-12 mx-auto mb-2 text-yellow-500" />',
         '<Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />'),
        ('text-center py-6 text-yellow-400 bg-navy-800 rounded-lg border border-navy-700',
         'text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200'),
        ('<Clock className="h-10 w-10 mx-auto mb-2 text-yellow-500" />',
         '<Clock className="h-10 w-10 mx-auto mb-2 text-gray-300" />'),
        ('<AlertCircle className="h-10 w-10 mx-auto mb-2 text-yellow-500" />',
         '<AlertCircle className="h-10 w-10 mx-auto mb-2 text-gray-300" />'),
        ('<Package className="h-10 w-10 mx-auto mb-2 text-yellow-500" />',
         '<Package className="h-10 w-10 mx-auto mb-2 text-gray-300" />'),
        # Item cards
        ('className="bg-navy-800 p-4 rounded-lg border border-navy-700">',
         'className="bg-gray-50 p-4 rounded-lg border border-gray-200">'),
        ('className="bg-navy-800 p-3 rounded-lg border border-navy-700">',
         'className="bg-gray-50 p-3 rounded-lg border border-gray-200">'),
        ('<h4 className="text-white font-medium">Donation Item', '<h4 className="text-gray-900 font-medium">Donation Item'),
        ('<h4 className="text-white font-medium text-sm">Schedule Item', '<h4 className="text-gray-900 font-medium text-sm">Schedule Item'),
        # Inner labels
        ('<label className="block text-yellow-200 text-xs sm:text-sm mb-1">',
         '<label className="block text-gray-700 text-xs sm:text-sm mb-1">'),
        # Inner inputs (bg-navy-700 border-navy-600)
        ('bg-navy-700 border border-navy-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500',
         'bg-white border border-gray-200 rounded text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500'),
        # What to bring input (focus:ring-skyblue-500)
        ('focus:ring-skyblue-500"\n                    placeholder="e.g., Water bottle',
         'focus:ring-blue-500"\n                    placeholder="e.g., Water bottle'),
        # Contact info inputs
        ('bg-navy-800 border border-navy-700 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500',
         'bg-white border border-gray-200 rounded text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500'),
        # Footer border
        ('gap-3 sm:gap-4 pt-6 border-t border-navy-700',
         'gap-3 sm:gap-4 pt-6 border-t border-gray-200'),
        # Cancel button in footer
        ('btn border border-gray-600 text-gray-400 bg-navy-800 hover:bg-navy-700 py-3 sm:py-2',
         'btn border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 py-3 sm:py-2'),
    ]
)

# ── PickupManagementModal ─────────────────────────────────────────────────────
print('=== PickupManagementModal ===')
fix_file(
    r'd:\Capstone\Hopelink\src\modules\delivery\components\PickupManagementModal.jsx',
    [
        ('className="bg-navy-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"',
         'className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"'),
        ('<h2 className="text-xl font-bold text-white">Pickup Management</h2>',
         '<h2 className="text-xl font-bold text-gray-900">Pickup Management</h2>'),
        ('<p className="text-skyblue-300">{donation.title}</p>',
         '<p className="text-gray-500">{donation.title}</p>'),
        ('hover:text-white hover:bg-navy-800 rounded-lg transition-colors',
         'hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors'),
        ('mb-6 p-4 bg-navy-800 rounded-lg', 'mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200'),
        ('<h3 className="text-lg font-semibold text-white">Current Status</h3>',
         '<h3 className="text-lg font-semibold text-gray-900">Current Status</h3>'),
        ('<p className="text-skyblue-300 text-sm">{pickup?.notes}</p>',
         '<p className="text-gray-600 text-sm">{pickup?.notes}</p>'),
        ('<h3 className="text-lg font-semibold text-white">Pickup Information</h3>',
         '<h3 className="text-lg font-semibold text-gray-900">Pickup Information</h3>'),
        ('<p className="text-white font-medium">Pickup Location</p>',
         '<p className="text-gray-900 font-medium">Pickup Location</p>'),
        ('<p className="text-skyblue-300 text-sm">{pickup?.pickup_location || donation.pickup_location}</p>',
         '<p className="text-gray-600 text-sm">{pickup?.pickup_location || donation.pickup_location}</p>'),
        ('<p className="text-white font-medium">Instructions</p>',
         '<p className="text-gray-900 font-medium">Instructions</p>'),
        ('<p className="text-skyblue-300 text-sm">{pickup.pickup_instructions}</p>',
         '<p className="text-gray-600 text-sm">{pickup.pickup_instructions}</p>'),
        ('<p className="text-white font-medium">\n                    {isDonor ? \'Recipient\' : \'Donor\'}',
         '<p className="text-gray-900 font-medium">\n                    {isDonor ? \'Recipient\' : \'Donor\'}'),
        ('<p className="text-skyblue-300 text-sm">\n                    {isDonor ? claim.recipient?.name',
         '<p className="text-gray-600 text-sm">\n                    {isDonor ? claim.recipient?.name'),
        ('className="text-skyblue-400 hover:text-skyblue-300 text-sm flex items-center gap-1 mt-1"',
         'className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 mt-1"'),
        ('<p className="text-white font-medium">Claimed</p>',
         '<p className="text-gray-900 font-medium">Claimed</p>'),
        ('<p className="text-skyblue-300 text-sm">\n                    {new Date(claim.claimed_at)',
         '<p className="text-gray-600 text-sm">\n                    {new Date(claim.claimed_at)'),
        ('mb-6 p-4 bg-navy-800 rounded-lg"\n            >\n            <h3 className="text-lg font-semibold text-white mb-4">Update Pickup Status</h3>',
         'mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"\n            >\n            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Pickup Status</h3>'),
        ('text-sm font-medium text-white mb-2"\n                >\n                  New Status',
         'text-sm font-medium text-gray-900 mb-2"\n                >\n                  New Status'),
        ('bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-skyblue-500"',
         'bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"'),
        ('text-sm font-medium text-white mb-2"\n                >\n                  Notes',
         'text-sm font-medium text-gray-900 mb-2"\n                >\n                  Notes'),
        ('bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-skyblue-500 resize-none h-20"',
         'bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"'),
        ('<h3 className="text-lg font-semibold text-white">Confirm Pickup Completion</h3>',
         '<h3 className="text-lg font-semibold text-gray-900">Confirm Pickup Completion</h3>'),
        ('text-sm font-medium text-white mb-2"\n                >\n                  Rate this',
         'text-sm font-medium text-gray-900 mb-2"\n                >\n                  Rate this'),
        ('text-sm font-medium text-white mb-2"\n                >\n                  Feedback',
         'text-sm font-medium text-gray-900 mb-2"\n                >\n                  Feedback'),
        ('<h3 className="text-lg font-semibold text-white">Transaction Completed!</h3>',
         '<h3 className="text-lg font-semibold text-gray-900">Transaction Completed!</h3>'),
    ]
)

print('All done!')
