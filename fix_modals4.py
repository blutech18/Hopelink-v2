import os, shutil

BASE = r'd:\Capstone\Hopelink\src'

def fix(path, replacements):
    if not os.path.exists(path):
        print(f'  ✗ FILE NOT FOUND: {path}')
        return
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
    print(f'  ✓ {os.path.basename(path)} @ {os.path.relpath(path, BASE)}: {found}/{len(replacements)} applied')

def copy_fixed(src_path, dest_path):
    """Copy a fixed file to a duplicate location (preserving the fixed src)."""
    if not os.path.exists(src_path):
        print(f'  ✗ SOURCE NOT FOUND: {src_path}')
        return
    shutil.copy2(src_path, dest_path)
    print(f'  ✓ Copied {os.path.basename(src_path)} → {os.path.relpath(dest_path, BASE)}')

print('=== Fix CreateEventModal remaining patterns (py-2.5 date/time inputs) ===')
CREATE_EVENT_REMAINING = [
    # Event Type select (py-2.5 sm:py-2 variant)
    ('className="w-full px-4 py-2.5 sm:py-2 bg-navy-800 border border-navy-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-500"',
     'className="w-full px-4 py-2.5 sm:py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"'),
    # Date/Time labels (text-white that were missed)
    ('<label className="block text-white font-medium mb-2">\n                  <Calendar className="h-4 w-4 inline mr-2 text-gray-400" />\n                  Start Date',
     '<label className="block text-gray-900 font-medium mb-2">\n                  <Calendar className="h-4 w-4 inline mr-2 text-gray-400" />\n                  Start Date'),
    ('<label className="block text-white font-medium mb-2">\n                  <Clock className="h-4 w-4 inline mr-2 text-gray-400" />\n                  Start Time',
     '<label className="block text-gray-900 font-medium mb-2">\n                  <Clock className="h-4 w-4 inline mr-2 text-gray-400" />\n                  Start Time'),
    ('<label className="block text-white font-medium mb-2">\n                  <Calendar className="h-4 w-4 inline mr-2 text-gray-400" />\n                  End Date',
     '<label className="block text-gray-900 font-medium mb-2">\n                  <Calendar className="h-4 w-4 inline mr-2 text-gray-400" />\n                  End Date'),
    ('<label className="block text-white font-medium mb-2">\n                  <Clock className="h-4 w-4 inline mr-2 text-gray-400" />\n                  End Time',
     '<label className="block text-gray-900 font-medium mb-2">\n                  <Clock className="h-4 w-4 inline mr-2 text-gray-400" />\n                  End Time'),
    # What-to-bring inner input (bg-navy-700 remained after partial fix)
    ('className="flex-1 px-3 py-2 bg-navy-700 border border-navy-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"',
     'className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"'),
]
fix(fr'{BASE}\modules\events\components\CreateEventModal.jsx', CREATE_EVENT_REMAINING)

# Apply the SAME remaining fixes to the components/ui copy
print('\n=== Fix components/ui/CreateEventModal.jsx (apply same changes as modules version + all original fixes) ===')
# The ui copy needs ALL the changes from both fix_modals2.py and CREATE_EVENT_REMAINING
# Instead of listing all 50+ replacements again, just copy the fixed modules version
# but only if they appear to have identical content apart from imports.
# For safety, let's apply targeted fixes since imports might differ slightly.
CREATE_EVENT_UI_ALL = [
    # Container / header
    ('relative bg-navy-800 rounded-lg shadow-xl border border-navy-700 w-full max-w-4xl',
     'relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-4xl'),
    ('flex items-center justify-between p-4 sm:p-6 border-b border-navy-700',
     'flex items-center justify-between p-4 sm:p-6 border-b border-gray-200'),
    ('p-2 bg-navy-700 rounded-lg flex-shrink-0', 'p-2 bg-blue-50 rounded-lg flex-shrink-0'),
    ('<Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300" />', '<Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />'),
    ('<h2 className="text-lg sm:text-xl font-bold text-white">', '<h2 className="text-lg sm:text-xl font-bold text-gray-900">'),
    ('<p className="text-yellow-300 text-xs sm:text-sm hidden sm:block">', '<p className="text-gray-500 text-xs sm:text-sm hidden sm:block">'),
    ('className="p-2 text-yellow-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors flex-shrink-0"', 'className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"'),
    # Main bg-navy-800 inputs (normal py-2 variants)
    ('bg-navy-800 border border-navy-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500', 'bg-white border border-gray-200 rounded-lg text-gray-900 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'),
    # py-2.5 variant of main inputs (event type select + date/time)
    ('className="w-full px-4 py-2.5 sm:py-2 bg-navy-800 border border-navy-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-500"', 'className="w-full px-4 py-2.5 sm:py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"'),
    # Labels text-white → text-gray-900
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
    # Date/Time labels (text-white with calendar/clock icons)
    ('<label className="block text-white font-medium mb-2">\n                  <Calendar className="h-4 w-4 inline mr-2 text-gray-400" />\n                  Start Date', '<label className="block text-gray-900 font-medium mb-2">\n                  <Calendar className="h-4 w-4 inline mr-2 text-gray-400" />\n                  Start Date'),
    ('<label className="block text-white font-medium mb-2">\n                  <Clock className="h-4 w-4 inline mr-2 text-gray-400" />\n                  Start Time', '<label className="block text-gray-900 font-medium mb-2">\n                  <Clock className="h-4 w-4 inline mr-2 text-gray-400" />\n                  Start Time'),
    ('<label className="block text-white font-medium mb-2">\n                  <Calendar className="h-4 w-4 inline mr-2 text-gray-400" />\n                  End Date', '<label className="block text-gray-900 font-medium mb-2">\n                  <Calendar className="h-4 w-4 inline mr-2 text-gray-400" />\n                  End Date'),
    ('<label className="block text-white font-medium mb-2">\n                  <Clock className="h-4 w-4 inline mr-2 text-gray-400" />\n                  End Time', '<label className="block text-gray-900 font-medium mb-2">\n                  <Clock className="h-4 w-4 inline mr-2 text-gray-400" />\n                  End Time'),
    # Location button
    ('bg-yellow-400 text-navy-900 rounded-lg hover:bg-yellow-500 transition-all active:scale-95 flex items-center justify-center gap-2 font-medium text-sm sm:text-base flex-shrink-0', 'bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 font-medium text-sm sm:text-base flex-shrink-0'),
    # Image upload
    ('<p className="text-yellow-400 text-xs sm:text-sm mb-3">', '<p className="text-gray-500 text-xs sm:text-sm mb-3">'),
    ('border border-navy-700"\n                    />', 'border border-gray-200"\n                    />'),
    ('border-2 border-dashed border-navy-700 rounded-lg p-8', 'border-2 border-dashed border-gray-200 rounded-lg p-8'),
    ('<Upload className="h-12 w-12 text-yellow-500 mx-auto mb-4" />', '<Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />'),
    ('<p className="text-yellow-400 text-xs sm:text-sm">\n                      Drop an image', '<p className="text-gray-500 text-xs sm:text-sm">\n                      Drop an image'),
    ('<p className="text-yellow-500 text-xs mt-1">', '<p className="text-gray-400 text-xs mt-1">'),
    ('<Calendar className="h-4 w-4 inline mr-2 text-yellow-400" />', '<Calendar className="h-4 w-4 inline mr-2 text-gray-400" />'),
    ('<Clock className="h-4 w-4 inline mr-2 text-yellow-400" />', '<Clock className="h-4 w-4 inline mr-2 text-gray-400" />'),
    # Add buttons gradient
    ('px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white rounded-lg font-medium transition-all active:scale-95 flex items-center gap-2 shadow-md', 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all active:scale-95 flex items-center gap-2 shadow-md'),
    # Empty states
    ('text-center py-8 text-yellow-400 bg-navy-800 rounded-lg border border-navy-700', 'text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200'),
    ('<Package className="h-12 w-12 mx-auto mb-2 text-yellow-500" />', '<Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />'),
    ('text-center py-6 text-yellow-400 bg-navy-800 rounded-lg border border-navy-700', 'text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200'),
    ('<Clock className="h-10 w-10 mx-auto mb-2 text-yellow-500" />', '<Clock className="h-10 w-10 mx-auto mb-2 text-gray-300" />'),
    ('<AlertCircle className="h-10 w-10 mx-auto mb-2 text-yellow-500" />', '<AlertCircle className="h-10 w-10 mx-auto mb-2 text-gray-300" />'),
    ('<Package className="h-10 w-10 mx-auto mb-2 text-yellow-500" />', '<Package className="h-10 w-10 mx-auto mb-2 text-gray-300" />'),
    # Item cards bg-navy-800
    ('className="bg-navy-800 p-4 rounded-lg border border-navy-700">', 'className="bg-gray-50 p-4 rounded-lg border border-gray-200">'),
    ('className="bg-navy-800 p-3 rounded-lg border border-navy-700">', 'className="bg-gray-50 p-3 rounded-lg border border-gray-200">'),
    ('<h4 className="text-white font-medium">Donation Item', '<h4 className="text-gray-900 font-medium">Donation Item'),
    ('<h4 className="text-white font-medium text-sm">Schedule Item', '<h4 className="text-gray-900 font-medium text-sm">Schedule Item'),
    ('<label className="block text-yellow-200 text-xs sm:text-sm mb-1">', '<label className="block text-gray-700 text-xs sm:text-sm mb-1">'),
    ('bg-navy-700 border border-navy-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500', 'bg-white border border-gray-200 rounded text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500'),
    # What-to-bring inner input (blue ring already changed, just fix bg)
    ('className="flex-1 px-3 py-2 bg-navy-700 border border-navy-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"', 'className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"'),
    # Contact info inputs
    ('bg-navy-800 border border-navy-700 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500', 'bg-white border border-gray-200 rounded text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500'),
    # Footer
    ('gap-3 sm:gap-4 pt-6 border-t border-navy-700', 'gap-3 sm:gap-4 pt-6 border-t border-gray-200'),
    ('btn border border-gray-600 text-gray-400 bg-navy-800 hover:bg-navy-700 py-3 sm:py-2', 'btn border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 py-3 sm:py-2'),
    # also skyblue focus ring
    ('focus:ring-skyblue-500"\n                    placeholder="e.g., Water bottle', 'focus:ring-blue-500"\n                    placeholder="e.g., Water bottle'),
]
fix(fr'{BASE}\components\ui\CreateEventModal.jsx', CREATE_EVENT_UI_ALL)

print('\n=== Copy fixed files to their duplicate locations ===')
# src/modules/events/ mirrors of components/ui/
copy_fixed(
    fr'{BASE}\components\ui\AttendanceModal.jsx',
    fr'{BASE}\modules\events\components\AttendanceModal.jsx'
)
copy_fixed(
    fr'{BASE}\components\ui\CancelEventConfirmationModal.jsx',
    fr'{BASE}\modules\events\components\CancelEventConfirmationModal.jsx'
)
copy_fixed(
    fr'{BASE}\modules\events\components\JoinEventConfirmationModal.jsx',
    fr'{BASE}\components\ui\JoinEventConfirmationModal.jsx'
)
# src/modules/delivery/ mirrors
copy_fixed(
    fr'{BASE}\components\ui\DeliveryConfirmationModal.jsx',
    fr'{BASE}\modules\delivery\components\DeliveryConfirmationModal.jsx'
)
copy_fixed(
    fr'{BASE}\components\ui\DirectDeliveryManagementModal.jsx',
    fr'{BASE}\modules\delivery\components\DirectDeliveryManagementModal.jsx'
)
copy_fixed(
    fr'{BASE}\modules\delivery\components\PickupManagementModal.jsx',
    fr'{BASE}\components\ui\PickupManagementModal.jsx'
)
# src/modules/recipient/ mirror
copy_fixed(
    fr'{BASE}\modules\recipient\components\RecipientProfileModal.jsx',
    fr'{BASE}\components\ui\RecipientProfileModal.jsx'
)
# src/modules/profile/ mirror
copy_fixed(
    fr'{BASE}\modules\profile\components\VerificationRequiredModal.jsx',
    fr'{BASE}\components\ui\VerificationRequiredModal.jsx'
)
# src/shared/ mirrors
copy_fixed(
    fr'{BASE}\components\ui\ConfirmationModal.jsx',
    fr'{BASE}\shared\components\ui\ConfirmationModal.jsx'
)
copy_fixed(
    fr'{BASE}\components\ui\ReportUserModal.jsx',
    fr'{BASE}\shared\components\ui\ReportUserModal.jsx'
)

print('\n=== Final scan ===')
import re, os
dark_files = []
for root, dirs, files in os.walk(BASE):
    dirs[:] = [d for d in dirs if 'node_modules' not in d]
    for fname in files:
        if 'Modal' in fname and fname.endswith('.jsx'):
            fp = os.path.join(root, fname)
            with open(fp, encoding='utf-8') as f:
                c = f.read()
            n = len(re.findall(r'bg-navy|border-navy', c))
            if n > 0:
                dark_files.append(f'{os.path.relpath(fp, r"d:\\Capstone\\Hopelink\\src")}: {n} navy refs')

if dark_files:
    print('Files with remaining navy refs:')
    for f in dark_files:
        print(f'  {f}')
else:
    print('✓ All modal files are clean!')
