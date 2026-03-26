import re

# ── RecipientProfileModal ─────────────────────────────────────────────────────
path1 = r'd:\Capstone\Hopelink\src\modules\recipient\components\RecipientProfileModal.jsx'
with open(path1, encoding='utf-8') as f:
    src = f.read()

replacements = [
    # Main modal container
    (
        'bg-gradient-to-br from-navy-900/95 to-navy-800/95 rounded-2xl border-2 border-yellow-400/30 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto',
        'bg-white rounded-2xl border border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto'
    ),
    # Sticky header
    (
        'border-b border-yellow-400/20 bg-gradient-to-r from-yellow-500/5 to-transparent backdrop-blur-sm',
        'border-b border-gray-200 bg-white'
    ),
    # Header icon container
    (
        'p-2 rounded-lg bg-yellow-400/20 border border-yellow-400/30',
        'p-2 rounded-lg bg-blue-50 border border-blue-100'
    ),
    # Header icon
    (
        '<User className="h-6 w-6 text-yellow-400" />',
        '<User className="h-6 w-6 text-blue-500" />'
    ),
    # Header title
    (
        '<h3 className="text-xl font-bold text-white">Recipient Profile</h3>',
        '<h3 className="text-xl font-bold text-gray-900">Recipient Profile</h3>'
    ),
    # Header subtitle
    (
        '<p className="text-xs text-yellow-300/80 mt-0.5">Review recipient information</p>',
        '<p className="text-xs text-gray-500 mt-0.5">Review recipient information</p>'
    ),
    # Close button
    (
        'className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"',
        'className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"'
    ),
    # Verification description yellow-200
    (
        '<p className="text-sm text-yellow-200 mb-3">',
        '<p className="text-sm text-gray-600 mb-3">'
    ),
    # Verification date text
    (
        '<div className="flex items-center gap-2 text-xs text-yellow-300/80">',
        '<div className="flex items-center gap-2 text-xs text-gray-500">'
    ),
    # Profile section bg (used multiple times - all navy-800/50 + navy-700/50 border)
    (
        'bg-navy-800/50 rounded-xl p-6 border border-navy-700/50',
        'bg-gray-50 rounded-xl p-6 border border-gray-200'
    ),
    (
        'bg-navy-800/50 rounded-lg p-4 border border-navy-700/50 text-center',
        'bg-gray-50 rounded-lg p-4 border border-gray-200 text-center'
    ),
    # Avatar circle
    (
        'w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-400/10 border-2 border-yellow-400/30 flex items-center justify-center flex-shrink-0',
        'w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center flex-shrink-0'
    ),
    # Avatar icon  
    (
        '<User className="h-10 w-10 text-yellow-400" />',
        '<User className="h-10 w-10 text-gray-400" />'
    ),
    # Name
    (
        '<h4 className="text-xl font-bold text-white mb-1">',
        '<h4 className="text-xl font-bold text-gray-900 mb-1">'
    ),
    # Bio text
    (
        '<p className="text-sm text-yellow-200 leading-relaxed">',
        '<p className="text-sm text-gray-600 leading-relaxed">'
    ),
    # Stat values (text-2xl font-bold text-white)
    (
        '<p className="text-2xl font-bold text-white">',
        '<p className="text-2xl font-bold text-gray-900">'
    ),
    # Stat sublabels 
    (
        '<p className="text-xs text-yellow-200/80 mt-1">',
        '<p className="text-xs text-gray-500 mt-1">'
    ),
    # Section title text-white (contact, background)
    (
        'class="text-white font-semibold mb-4 text-sm flex items-center gap-2">',
        'class="text-gray-900 font-semibold mb-4 text-sm flex items-center gap-2">'
    ),
    # Section icons text-yellow-400
    (
        '<Mail className="h-4 w-4 text-yellow-400" />',
        '<Mail className="h-4 w-4 text-blue-500" />'
    ),
    (
        '<Mail className="h-4 w-4 text-yellow-400 flex-shrink-0" />',
        '<Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />'
    ),
    (
        '<Phone className="h-4 w-4 text-yellow-400 flex-shrink-0" />',
        '<Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />'
    ),
    (
        '<MapPin className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />',
        '<MapPin className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />'
    ),
    (
        '<Users className="h-4 w-4 text-yellow-400" />',
        '<Users className="h-4 w-4 text-blue-500" />'
    ),
    (
        '<Heart className="h-4 w-4 text-yellow-400" />',
        '<Heart className="h-4 w-4 text-blue-500" />'
    ),
    # Contact values text-sm text-white
    (
        '<p className="text-sm text-white">{recipient.email}</p>',
        '<p className="text-sm text-gray-800">{recipient.email}</p>'
    ),
    (
        '<p className="text-sm text-white">{recipient.phone_number}</p>',
        '<p className="text-sm text-gray-800">{recipient.phone_number}</p>'
    ),
    (
        '<p className="text-sm text-white">{recipient.address}</p>',
        '<p className="text-sm text-gray-800">{recipient.address}</p>'
    ),
    # Background info values
    (
        '<p className="text-sm text-white">{recipient.household_size}',
        '<p className="text-sm text-gray-800">{recipient.household_size}'
    ),
    (
        '<p className="text-sm text-white capitalize">{recipient.income_level}</p>',
        '<p className="text-sm text-gray-800 capitalize">{recipient.income_level}</p>'
    ),
    (
        '<p className="text-sm text-white">{recipient.special_needs}</p>',
        '<p className="text-sm text-gray-800">{recipient.special_needs}</p>'
    ),
    # Request section background
    (
        'bg-yellow-500/10 rounded-xl p-6 border border-yellow-400/20',
        'bg-blue-50 rounded-xl p-6 border border-blue-200'
    ),
    # Request description
    (
        '<p className="text-sm text-yellow-200">{request.description}</p>',
        '<p className="text-sm text-gray-600">{request.description}</p>'
    ),
    # Request values
    (
        '<p className="text-sm font-medium text-white">{request.title}</p>',
        '<p className="text-sm font-medium text-gray-900">{request.title}</p>'
    ),
    (
        '<p className="text-sm font-medium text-white">{request.quantity_needed}</p>',
        '<p className="text-sm font-medium text-gray-900">{request.quantity_needed}</p>'
    ),
    (
        '<p className="text-sm font-medium text-white capitalize">{request.urgency}</p>',
        '<p className="text-sm font-medium text-gray-900 capitalize">{request.urgency}</p>'
    ),
    # Footer sticky
    (
        'border-t border-yellow-400/20 bg-gradient-to-r from-yellow-500/5 to-transparent backdrop-blur-sm',
        'border-t border-gray-200 bg-white'
    ),
    # Footer close button
    (
        'className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-navy-950 font-bold rounded-lg transition-all shadow-lg shadow-yellow-500/30"',
        'className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md"'
    ),
    # Status yellow badge in getVerificationLevel
    (
        "color: 'text-yellow-400',\n        bgColor: 'bg-yellow-500/20',\n        borderColor: 'border-yellow-400/30',\n        icon: Clock,\n        description: 'Verification in progress'",
        "color: 'text-amber-600',\n        bgColor: 'bg-amber-50',\n        borderColor: 'border-amber-200',\n        icon: Clock,\n        description: 'Verification in progress'"
    ),
]

for old, new in replacements:
    if old in src:
        src = src.replace(old, new)
        print(f'✓ Replaced: {old[:60]}...')
    else:
        print(f'✗ NOT FOUND: {old[:60]}...')

with open(path1, 'w', encoding='utf-8') as f:
    f.write(src)

print('\nRecipientProfileModal.jsx done!\n')

# ── FeedbackModal (modules/feedback) ─────────────────────────────────────────
# Check if it's essentially the same as ui version (different imports only)
path2 = r'd:\Capstone\Hopelink\src\modules\feedback\components\FeedbackModal.jsx'
with open(path2, encoding='utf-8') as f:
    src2 = f.read()

feedback_replacements = [
    ('bg-navy-900 border-2 border-yellow-500/30 shadow-2xl rounded-lg sm:rounded-xl', 'bg-white border border-gray-200 shadow-2xl rounded-lg sm:rounded-xl'),
    ('border-b-2 border-yellow-500/20 flex-shrink-0', 'border-b border-gray-200 flex-shrink-0'),
    ('bg-yellow-500/10 rounded-lg flex-shrink-0', 'bg-blue-50 rounded-lg flex-shrink-0'),
    ('text-yellow-400" />\n              </div>\n              <div className="flex-1 min-w-0">\n                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white', 'text-blue-500" />\n              </div>\n              <div className="flex-1 min-w-0">\n                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900'),
    ('text-[10px] sm:text-xs text-yellow-300">', 'text-[10px] sm:text-xs text-gray-500">'),
    ('hover:bg-navy-800 rounded-lg flex-shrink-0 ml-2', 'hover:bg-gray-100 rounded-lg flex-shrink-0 ml-2'),
    ('hover:text-white transition-colors p-1.5 sm:p-2', 'hover:text-gray-700 transition-colors p-1.5 sm:p-2'),
    ('bg-navy-800/50 rounded-lg p-4 sm:p-5 border border-yellow-400/20', 'bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200'),
    ('font-medium text-white mb-3 sm:mb-4 text-center', 'font-medium text-gray-900 mb-3 sm:mb-4 text-center'),
    ('font-semibold text-yellow-300', 'font-semibold text-gray-700'),
    ('bg-navy-800/30 rounded-lg p-3 sm:p-5 border border-yellow-400/10 space-y-3 sm:space-y-5', 'bg-gray-50 rounded-lg p-3 sm:p-5 border border-gray-100 space-y-3 sm:space-y-5'),
    ('font-semibold text-white text-center border-b border-yellow-400/20', 'font-semibold text-gray-800 text-center border-b border-gray-200'),
    ('bg-navy-900/50 rounded-lg p-3 sm:p-4 border border-navy-700', 'bg-white rounded-lg p-3 sm:p-4 border border-gray-200'),
    ('font-medium text-white mb-2\n                  </label>\n                  Tell us about your experience', 'font-medium text-gray-900 mb-2\n                  </label>\n                  Tell us about your experience'),
    ('bg-yellow-900/20 border border-yellow-400/30', 'bg-blue-50 border border-blue-200'),
    ('text-yellow-300 text-[10px] sm:text-xs leading-relaxed', 'text-blue-700 text-[10px] sm:text-xs leading-relaxed'),
    ('border-t-2 border-yellow-500/20 flex-shrink-0', 'border-t border-gray-200 flex-shrink-0'),
    ('bg-navy-700 hover:bg-navy-600 text-yellow-300 rounded-lg transition-colors text-sm sm:text-base font-medium border border-navy-600 active:scale-95', 'bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm sm:text-base font-medium border border-gray-200 active:scale-95'),
    ('from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95', 'bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95'),
]

for old, new in feedback_replacements:
    if old in src2:
        src2 = src2.replace(old, new)
        print(f'✓ {old[:60]}')
    else:
        print(f'✗ NOT FOUND: {old[:60]}')

with open(path2, 'w', encoding='utf-8') as f:
    f.write(src2)

print('\nFeedbackModal (modules) done!\n')
