# MASTER PROMPT — CREATE A COMPLETE FREE DATING MOBILE APP WITH FULL INTERACTIONS

Build a complete, polished, production-quality mobile dating application for Android and iOS.

This is a **free dating application** with no subscription required for the core functionality.

The goal is to create not just static screens, but a **fully connected, realistic and seamless mobile product experience** where every major user action has a logical response, every button works, navigation is consistent, and all important success, loading, empty, error, permission and edge-case states are represented.

The application should feel like a real product that could be handed to an engineering team for development.

Take inspiration from the usability patterns of modern dating, social and messaging applications, but create an original visual identity and interaction model. Do not copy Tinder, Bumble, Hinge or any other application's branding or exact UI.

---

# 1. CORE PRODUCT

The application allows users to discover people based on:

* Location
* Distance
* Age
* Gender/preferences
* Online availability
* Recently active status
* Whether they have profile photos
* Search location selected manually on a map

The primary experience is:

**Open app → Create account → Set location → Discover people → Filter → Search → View profile → Message → Chat → Send photos → Audio/video call → Manage profile and privacy**

The product must support users who:

* Have profile photos
* Do not have profile photos
* Are online
* Are offline
* Have recently been active
* Are nearby
* Are further away within the selected radius
* Have never interacted with the current user
* Have already messaged the current user
* Have blocked/reported the current user
* Have been blocked by the current user

---

# 2. APPLICATION ARCHITECTURE

Use four primary bottom navigation areas:

**Discover**

**Search / Map**

**Chats**

**Profile**

The navigation must remain persistent where appropriate.

Every section should maintain its state when the user moves between sections.

Example:

If a user applies filters and opens a profile, then returns to Discover, the filters and search state should remain unless deliberately reset.

---

# 3. UNIVERSAL INTERACTION RULES

Every interactive element must have:

* Default state
* Pressed state
* Disabled state where applicable
* Loading state where applicable
* Success state
* Error state where applicable

Every screen must support:

* Back navigation
* Close interaction
* Loading
* Empty state
* Error handling where applicable
* Pull to refresh where appropriate
* Keyboard-aware layouts
* Safe areas
* Scroll behaviour

Bottom sheets should be dismissible using:

* Close button
* Swipe down
* Back action

Modals should support:

* Confirm
* Cancel
* Close

Destructive actions should always require confirmation.

---

# 4. APP LAUNCH

## Splash Screen

Display:

* Logo
* App name
* Loading animation

Automatically transition to the appropriate state.

Returning user:

**Splash → Home**

New user:

**Splash → Welcome**

Unverified user:

**Splash → Verification**

User who has already chosen a manual location:

**Splash → Discover**

---

# 5. WELCOME

Headline:

**Meet people around you.**

Supporting copy:

**Discover people nearby, chat instantly and connect based on where you are.**

Actions:

**Create Account**

**Log In**

**Continue with Google**

**Continue with Apple**

Interaction:

* Create Account opens onboarding
* Log In opens login
* Social authentication opens appropriate authentication state
* Back navigation should behave naturally

---

# 6. REGISTRATION

Create a complete multi-step onboarding flow.

Show:

**Step 1 of X**

Use a progress indicator.

Allow:

* Continue
* Back
* Skip where appropriate
* Edit previous information

Validate fields in real time.

Do not allow the user to continue when required information is invalid.

Show clear inline validation.

---

# 7. NAME + AGE

Fields:

**First name**

**Date of birth**

Automatically calculate age.

Validation:

* Name cannot be empty
* Date must be valid
* User must meet the minimum age requirement

If underage:

Show:

**You must be at least 18 to use this app.**

Do not allow registration to continue.

---

# 8. GENDER & DISCOVERY PREFERENCES

Ask:

**How do you identify?**

Options such as:

* Woman
* Man
* Non-binary
* Prefer not to say

Then:

**Who would you like to discover?**

Allow multiple selections.

Allow preferences to be changed later.

---

# 9. PROFILE PHOTO SETUP

User interaction options:

**Take Photo**

**Choose from Gallery**

**Skip for now**

Support:

* Add photo
* Replace photo
* Delete photo
* Reorder photos
* Set primary photo

Profile can exist without a photo.

When the user has no photo:

Display a professional avatar/initial-based design.

Do not make the profile look broken.

---

# 10. CAMERA INTERACTION

When camera is selected:

Show:

* Camera preview
* Front/back camera
* Flash option where appropriate
* Capture
* Cancel

After capture:

Show preview.

Actions:

**Retake**

**Use Photo**

Handle camera permission denial.

Show:

**Camera access is needed to take a profile photo.**

Allow the user to open system settings when necessary.

---

# 11. PHOTO UPLOAD

Gallery flow:

* Open photo picker
* Select one or multiple photos
* Preview
* Crop if needed
* Confirm
* Upload
* Show upload progress
* Show upload success
* Handle upload failure

Failed upload:

**Photo couldn't be uploaded.**

**Retry**

Do not lose previously selected photos.

---

# 12. BIO & PROFILE INFORMATION

Allow:

* Bio
* Interests
* Job
* Education
* Languages
* Relationship preferences where applicable

Show character limits.

Counter example:

**142 / 250**

Validate excessive text.

Allow saving or cancelling changes.

---

# 13. LOCATION ONBOARDING

Ask:

**Find people near you**

Explain:

**Use your location to discover people nearby. Your exact location will never be displayed to other users.**

Buttons:

**Use My Current Location**

**Choose Location on Map**

---

# 14. LOCATION PERMISSION

Before requesting OS permission, explain why it is required.

If permission is granted:

* Detect location
* Convert it to a usable city/area
* Set discovery location
* Display nearby people

If permission is denied:

Show:

**Location access is unavailable.**

Actions:

**Choose Location Manually**

**Try Again**

**Open Settings**

Never expose exact coordinates to another user.

---

# 15. MANUAL LOCATION SELECTION

Create a full map experience.

Support:

* Pan map
* Zoom in
* Zoom out
* Search location
* Drop/move pin
* Current location
* Confirm location

Use a movable central pin interaction.

Bottom sheet:

**Search from this location**

Display selected area.

CTA:

**Search Here**

After selection:

Update discovery results.

---

# 16. DISCOVERY HOME

Primary screen:

Header:

**People near you**

Current location:

**📍 Central London**

Actions:

* Change location
* Search
* Map
* Filters
* Refresh

Profile results appear immediately.

---

# 17. DISCOVERY PROFILE CARD

Each result can contain:

* Main image
* Additional photo indicator
* Name
* Age
* Distance
* Online status
* Recent activity
* Bio preview
* Interests

Example:

**Emma, 28**

🟢 Online

**2.4 km away**

**Coffee • Travel • Music**

Buttons:

**View Profile**

**Message**

---

# 18. PROFILE CARD INTERACTIONS

Support:

* Tap profile → Open full profile
* Tap image → Full-screen photo
* Tap Message → Open conversation
* Tap More → Action menu
* Scroll through profile where applicable
* Pull down/up naturally

Do not rely solely on swiping left/right like Tinder.

The main experience should support efficient browsing of multiple users.

---

# 19. ONLINE STATUS

Statuses:

**Online**

**Active 5 min ago**

**Active 1 hr ago**

**Active today**

**Offline**

Use privacy-friendly approximate activity.

A user's exact last-seen time should not be unnecessarily exposed.

---

# 20. SEARCH

Search section should allow:

**List View**

and

**Map View**

Search must support the same discovery criteria.

---

# 21. FILTERS

Create a complete filter experience.

## Age

Range slider.

Example:

**25–35**

## Distance

Range:

**1–100 km**

## Availability

* Everyone
* Online now
* Recently active

## Photos

* Everyone
* With photos only
* Without photos only

## Gender

Multiple selections.

## Sort

* Distance
* Recently active
* New users
* Relevance

Show active filters as removable chips.

Example:

**25–35 ×**

**25 km ×**

**Online ×**

Allow:

**Clear all**

CTA:

**Show 126 people**

---

# 22. FILTER INTERACTIONS

When user changes a filter:

* Update selected value
* Update result count where possible
* Enable/disable relevant controls
* Preserve previous selections

When user taps Apply:

* Close filter panel
* Update results
* Scroll to top
* Display active filter chips

When user taps Reset:

* Restore default filters

When there are zero results:

Show:

**No profiles match these filters.**

Actions:

**Adjust Filters**

**Change Location**

---

# 23. MAP DISCOVERY

Display:

* Search location
* Search radius
* Nearby profile markers
* Marker clusters when many users exist

Profile marker:

Tap marker → show mini profile preview.

Preview:

**Emma, 28**

**2.4 km**

🟢 Online

**View Profile**

Switch:

**Map / List**

---

# 24. EXACT LOCATION PRIVACY

Never show:

* Exact home location
* Exact coordinates
* Exact address
* Real-time location trail

Only show approximate distance or general area.

---

# 25. FULL PROFILE

Profile includes:

* Photo carousel
* Name
* Age
* Online status
* Distance
* Bio
* Interests
* Optional profile information

Interactions:

* Swipe photos
* Tap photo for full screen
* Zoom photo if supported
* Scroll profile
* Message
* More options

Actions:

**Message**

**Block**

**Report**

---

# 26. FULL-SCREEN PHOTO VIEWER

Support:

* Swipe between photos
* Pinch to zoom
* Double tap zoom where appropriate
* Close
* Swipe down to dismiss where appropriate

Loading image:

Show skeleton/spinner.

Broken image:

Show fallback state.

---

# 27. MESSAGE ENTRY FROM PROFILE

When user taps:

**Message**

If conversation doesn't exist:

Create conversation and open chat.

If conversation exists:

Open existing chat.

If user is blocked:

Show appropriate blocked state.

If messaging is unavailable:

Explain why.

---

# 28. CHAT LIST

Show:

* Profile image/avatar
* Name
* Last message
* Time
* Online status
* Unread count
* Missed call indicator
* Photo indicator

Support:

* Scroll
* Pull to refresh
* Tap conversation
* Swipe conversation for actions

Possible swipe actions:

**Mute**

**Delete**

**Block**

Confirm destructive actions.

---

# 29. CHAT SCREEN

Header:

* Back
* Avatar
* Name
* Online status
* Audio call
* Video call
* More

Message area:

* Incoming messages
* Outgoing messages
* Dates
* Unread marker
* Typing indicator

Composer:

**Write a message...**

Actions:

* Emoji
* Camera
* Gallery
* Attachment
* Microphone
* Send

---

# 30. TYPING INTERACTION

When user starts typing:

* Composer expands as needed
* Send button appears
* Typing indicator is shown appropriately

Other person typing:

**Emma is typing...**

When typing stops:

Remove indicator.

---

# 31. TEXT MESSAGES

Support:

* Send
* Edit where supported
* Delete where supported
* Retry failed message
* Copy text
* Reply if desired
* Long press actions

Message states:

**Sending**

**Sent**

**Delivered**

**Read**

**Failed**

Failed message:

**Tap to retry**

---

# 32. EMOJIS

Create emoji picker interaction.

Support:

* Frequently used
* Categories
* Search
* Insert emoji
* Close picker

Keyboard should resize content naturally.

---

# 33. PHOTO MESSAGING

User taps camera/gallery.

Flow:

**Choose → Preview → Optional crop → Send**

Support multiple images.

Show:

* Upload progress
* Sent image
* Failed upload
* Retry

Tap image:

Open full-screen viewer.

---

# 34. VOICE MESSAGES

Hold microphone to record.

States:

* Recording
* Pause
* Cancel
* Send

Show waveform.

After sending:

Voice message bubble.

Interactions:

* Play/pause
* Progress
* Duration

Handle microphone permission.

---

# 35. ATTACHMENTS

Attachment menu:

* Camera
* Photos
* Voice message
* Location

Location sharing must require explicit confirmation.

Show:

**Share your approximate location?**

Do not share exact current coordinates automatically.

---

# 36. AUDIO CALL

From chat, tap audio call.

Outgoing:

**Calling Emma...**

States:

* Calling
* Connecting
* Connected
* Reconnecting
* Ended
* Declined
* Busy
* No answer
* Network failure

Active call:

* Profile
* Name
* Duration
* Mute
* Speaker
* End

---

# 37. INCOMING AUDIO CALL

Display:

**Emma is calling**

Actions:

**Accept**

**Decline**

Support incoming-call notification behaviour.

---

# 38. VIDEO CALL

From chat:

Tap video icon.

States:

* Calling
* Connecting
* Connected
* Reconnecting
* Ended
* Declined
* No answer
* Camera unavailable
* Microphone unavailable
* Network failure

Active call:

* Full-screen remote video
* Self preview
* Mute
* Camera on/off
* Switch camera
* Speaker
* End

---

# 39. VIDEO CALL PERMISSIONS

If camera permission denied:

**Camera access is required for video calling.**

Actions:

**Allow Camera**

**Cancel**

If microphone permission denied:

**Microphone access is required for calling.**

Support opening system settings.

---

# 40. CALL HISTORY

Within chats, show:

* Incoming call
* Outgoing call
* Missed call
* Duration

Example:

**Missed video call**

**5 min ago**

Tapping can initiate a new call.

---

# 41. NOTIFICATIONS

Support notifications for:

* New message
* New chat
* Incoming call
* Missed call
* Profile activity
* Safety events

Unread badges should update immediately.

Tapping a notification should deep-link to the correct screen.

Example:

New message notification → open correct conversation.

Missed call notification → open chat/call history.

---

# 42. DEEP LINKING

Every important notification must take the user to the correct destination.

Examples:

Message → Chat

Profile interaction → Profile

Incoming call → Call screen

Safety notification → Safety section

---

# 43. PROFILE MANAGEMENT

My Profile screen:

* Profile preview
* Edit
* Photos
* Bio
* Preferences
* Location
* Privacy
* Safety
* Notifications
* Security
* Help
* Logout
* Delete account

---

# 44. EDIT PROFILE

Each field should support:

* Edit
* Save
* Cancel
* Validation
* Loading
* Success
* Error

After successful save:

Show a subtle confirmation:

**Profile updated**

---

# 45. PHOTO MANAGEMENT

Support:

* Add
* Delete
* Replace
* Reorder
* Set primary photo

Deleting the final photo should be allowed because photo-less profiles are supported.

---

# 46. DISCOVERY SETTINGS

Allow user to change:

* Gender preferences
* Age range
* Distance
* Online availability
* Photo preference
* Sorting

Changes should affect future discovery.

---

# 47. LOCATION SETTINGS

Display:

**Searching from**

Location name.

Actions:

**Use Current Location**

**Change Location**

**Choose on Map**

Show:

**Your exact location is never shown to other users.**

---

# 48. PRIVACY SETTINGS

Options:

* Show online status
* Show activity status
* Show profile in discovery
* Allow messages
* Location privacy
* Photo visibility where supported

Changes must save correctly.

Use toggles.

---

# 49. SAFETY CENTER

Include:

**Block**

**Report**

**Blocked Users**

**Safety Tips**

**Meeting Safety**

**Help & Support**

Make safety features easy to find.

---

# 50. REPORTING

Report profile:

Reasons:

* Fake profile
* Spam
* Scam
* Harassment
* Inappropriate content
* Underage
* Other

Optional comments.

Submit.

Loading:

**Submitting report...**

Success:

**Report submitted**

Remove/report state appropriately.

---

# 51. BLOCKING

Block confirmation:

**Block Emma?**

**They will no longer be able to message you or appear in your discovery results.**

Actions:

**Cancel**

**Block**

After block:

* Remove profile from discovery
* Remove from chat availability
* Prevent future messages
* Update blocked users list

---

# 52. UNBLOCKING

Blocked Users:

Display profiles.

Action:

**Unblock**

Confirmation:

**Unblock Emma?**

After confirmation:

**User unblocked**

Return user to blocked list.

---

# 53. ACCOUNT SECURITY

Security section:

* Change password
* Email verification
* Phone verification
* Active sessions
* Sign out of all devices
* Delete account

Sensitive actions require additional confirmation.

---

# 54. DELETE ACCOUNT

Create multi-step confirmation.

First:

**Delete your account?**

Explain consequences.

Require confirmation.

Second confirmation:

**This permanently removes your account and profile.**

Actions:

**Keep Account**

**Delete Account**

After deletion:

Display account deletion confirmation and return to welcome/login flow.

---

# 55. LOGOUT

Confirmation:

**Log out of this device?**

Actions:

**Cancel**

**Log Out**

After logout:

Return to Welcome.

---

# 56. NETWORK STATES

The application must behave gracefully when internet access changes.

Offline:

Display:

**You're offline**

Previously loaded content can remain visible where appropriate.

Messages composed offline:

Show:

**Waiting to send**

When connection returns:

Automatically retry where appropriate.

---

# 57. LOADING STATES

Create skeleton/loading states for:

* Discover
* Search
* Map
* Profile
* Chats
* Messages
* Photos
* Calls

Never leave large blank areas while content is loading.

---

# 58. ERROR STATES

Examples:

**Something went wrong**

**We couldn't load nearby people.**

**Try Again**

Photo upload:

**Photo couldn't be uploaded.**

**Retry**

Message:

**Message failed to send.**

**Retry**

Location:

**We couldn't determine your location.**

Network:

**You're offline.**

Each error should provide the most useful next action.

---

# 59. EMPTY STATES

No nearby users:

**No one nearby yet**

**Try expanding your search area or changing your location.**

CTA:

**Adjust Search**

No results:

**No profiles match your filters.**

CTA:

**Change Filters**

No chats:

**Your conversations will appear here.**

No photos:

**Add a photo to make your profile more personal.**

---

# 60. ACCESSIBILITY

The application should support:

* Readable font sizes
* Adequate contrast
* Large touch targets
* Screen-reader-friendly labels
* Logical focus order
* Keyboard-friendly forms
* Clear error messages
* Non-colour-only status indicators

Do not use colour as the only way to communicate important information.

---

# 61. MOBILE GESTURES

Where appropriate support:

* Swipe
* Scroll
* Pull to refresh
* Swipe-to-dismiss
* Long press
* Pinch to zoom
* Tap
* Double tap where appropriate
* Drag to reorder
* Drag map
* Bottom sheet swipe

Gestures must never conflict with normal operating-system navigation.

---

# 62. KEYBOARD BEHAVIOUR

When keyboard opens:

* Chat composer remains visible
* Input fields scroll into view
* Bottom navigation should behave naturally
* Keyboard dismissal should be easy
* No important controls should be covered

---

# 63. CONFIRMATION & TOASTS

Use lightweight confirmation messages where appropriate.

Examples:

**Profile updated**

**Photo added**

**Filters applied**

**User blocked**

**Report submitted**

**Message sent**

Avoid excessive popups.

---

# 64. BOTTOM SHEETS

Use bottom sheets for:

* Filters
* Profile actions
* Attachment options
* Report reasons where appropriate
* Call options
* Chat actions

Bottom sheets should support:

* Open
* Close
* Swipe down
* Back button
* Confirm

---

# 65. PROFILE ACTION MENU

More menu can contain:

* Share profile where supported
* Report
* Block
* Mute
* Hide profile

Keep safety controls easy to reach.

---

# 66. SEARCH STATE RETENTION

Remember the user's:

* Location
* Distance
* Age range
* Gender selection
* Online setting
* Photo preference
* Sort order

When they return to Discover.

Provide:

**Reset Search**

when the user wants to start again.

---

# 67. DISCOVERY RESULT REFRESH

Support pull-to-refresh.

Show:

**Updating people nearby...**

New users can appear.

Existing profiles should remain stable where appropriate.

Do not unexpectedly reset the user's filters.

---

# 68. REAL-TIME PRESENCE

When another user becomes online:

Update status appropriately.

When they go offline:

Update status.

Do not make UI jump unexpectedly.

Use subtle status updates.

---

# 69. REAL-TIME CHAT

Messages should appear immediately when received.

Support:

* Typing status
* Delivery state
* Read status
* New message indicator
* Scroll-to-latest
* Unread count

If user opens a conversation with unread messages:

Mark them as read appropriately.

---

# 70. CHAT SCROLL BEHAVIOUR

When opening a chat:

Scroll to latest message.

If user scrolls upward and receives a new message:

Show:

**1 new message**

Tapping it scrolls to the latest message.

---

# 71. MESSAGE CONTEXT ACTIONS

Long-press a message.

Show:

* Copy
* Reply
* Delete where applicable
* Report
* Other relevant actions

Create proper confirmation for deletion.

---

# 72. USER DISCOVERY SAFETY

Do not show blocked profiles.

Do not allow a reported user to continue appearing in inappropriate contexts.

Do not show exact user locations.

Do not expose sensitive account information.

---

# 73. AGE & SAFETY RESTRICTIONS

The app must be designed for adults.

Prevent underage registration.

Provide mechanisms for reporting suspected underage profiles.

---

# 74. SESSION MANAGEMENT

When returning to the app:

* Maintain authenticated session when valid
* Refresh data
* Update presence
* Restore navigation state when appropriate

Expired session:

Show:

**Your session has expired. Please log in again.**

---

# 75. APP PERMISSIONS

Create flows for:

* Location
* Camera
* Microphone
* Photos
* Notifications

Each permission must explain:

**Why the app needs it**

**What the user can do if they deny it**

Never assume permission is granted.

---

# 76. DATA PRIVACY UX

Clearly explain where needed:

* Location use
* Profile visibility
* Online status
* Photos
* Communication

Never expose personal data unnecessarily.

---

# 77. COMPONENT SYSTEM

Create reusable components for:

* Buttons
* Inputs
* Cards
* Profile cards
* Avatars
* Filter chips
* Sliders
* Toggles
* Navigation
* Bottom sheets
* Modals
* Toasts
* Status badges
* Chat bubbles
* Call controls
* Photo galleries
* Skeleton loaders
* Error states
* Empty states

Create variants for:

* Default
* Hover/pressed where applicable
* Disabled
* Loading
* Selected
* Error
* Success

---

# 78. DESIGN SYSTEM

Create a consistent system for:

### Typography

Use clear hierarchy:

* Display
* Heading
* Section heading
* Body
* Caption
* Labels

### Colours

Use a distinctive modern dating-app palette.

Prioritize:

* Trust
* Warmth
* Accessibility
* Strong contrast

### Shape

Use consistent rounded cards, buttons and controls.

### Spacing

Use a consistent spacing system.

### Icons

Use one consistent icon style.

---

# 79. TRANSITIONS

Use smooth transitions between:

* Discover → Profile
* Profile → Chat
* Chat → Call
* Search → Profile
* Map → Profile
* Settings → Sub-settings

Animations should be subtle and should never delay the user.

---

# 80. COMPLETE INTERACTION FLOW

The final prototype must allow this complete journey:

### New User

Splash
→ Welcome
→ Create Account
→ Name
→ Birthday
→ Gender
→ Preferences
→ Photos
→ Bio
→ Location Permission
→ Map/Current Location
→ Discover

### Discovery

Discover
→ Filter
→ Apply
→ Results
→ Map
→ Profile
→ Photo Viewer
→ Message

### Messaging

Profile
→ Chat
→ Send Text
→ Receive Message
→ Typing Indicator
→ Send Emoji
→ Send Photo
→ Send Voice Message
→ View Photo
→ Audio Call
→ Video Call

### Returning User

Splash
→ Discover

### Profile Management

Profile
→ Edit Profile
→ Edit Photos
→ Preferences
→ Location
→ Privacy
→ Safety
→ Notifications
→ Security
→ Logout/Delete

### Safety

Profile
→ More
→ Report / Block
→ Confirmation
→ Result

---

# 81. CRITICAL REQUIREMENT — DO NOT CREATE DEAD-END SCREENS

Every primary action must have a logical destination.

Do not create:

* Buttons that do nothing
* Navigation items with no screens
* Fake controls
* Unconnected pages
* Static filter controls
* Static maps
* Static chats
* Call buttons that don't lead to call states
* Profile actions without outcomes

Represent the interaction as a realistic working application prototype.

---

# 82. STATE MANAGEMENT

Where the prototype supports it, preserve state across interactions.

Examples:

If user:

* selects age 25–35
* sets distance to 25 km
* selects Online
* applies filter

Then the results should visibly reflect those selections.

If user:

* opens Emma's profile
* sends a message
* returns to Chats

Emma should appear in the chat list with the latest message.

If user:

* blocks Emma

Emma should no longer appear in discovery or chats.

If user:

* changes location

Discovery should reflect the new search location.

---

# 83. REALISTIC SAMPLE DATA

Create fictional sample users.

Example:

Emma, 28 — 2.4 km — Online

Sophie, 31 — 4.1 km — Active 8 min ago

Olivia, 26 — 7.2 km — Online

Alex, 30 — 5.6 km — No photo

Daniel, 34 — 8.3 km — Active 1 hr ago

Create realistic fictional conversations and messages.

---

# 84. DO NOT USE PLACEHOLDER INTERACTIONS

Instead of:

**Button**

Use:

**Message**

Instead of:

**Filter**

Use actual filter controls.

Instead of:

**Profile**

Create actual profile content.

Instead of:

**Chat**

Create realistic conversations.

The prototype should feel populated and testable.

---

# 85. FINAL QUALITY BAR

The application should feel:

* Complete
* Reliable
* Fast
* Safe
* Modern
* Human
* Simple
* Professional
* Production-oriented

A user should be able to move through the entire product without encountering unexplained dead ends.

Every major interaction should have a response.

Every feature should have appropriate loading, empty, error, success and permission states.

The final prototype should demonstrate the complete experience rather than only the happy path.

---

# 86. FINAL DELIVERABLE

Generate the full connected mobile application including:

**Authentication**

**Onboarding**

**Location**

**Map**

**Discovery**

**Search**

**Filters**

**Profiles**

**Photo galleries**

**Messaging**

**Photo sharing**

**Voice messages**

**Audio calling**

**Video calling**

**Notifications**

**Profile management**

**Privacy**

**Safety**

**Blocking**

**Reporting**

**Security**

**Settings**

**Error states**

**Loading states**

**Empty states**

**Permission states**

**Offline states**

**Account deletion**

**Logout**

Use a reusable component architecture and create a fully connected clickable prototype.

The core experience must remain **free with no subscription/paywall requirement**.

The most important product principle is:

**Every user action should produce a clear, predictable and seamless result.**
