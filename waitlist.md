# Waitlist Signup Flow Specification

## Overview
Create an engaging, multi-step signup flow that captures essential user information while showcasing different team options. The flow should be lightweight, progress-indicating, and easy to exit at any time.

## Technical Integration
- Form submissions handled by Formspree.io
- Modal can be closed at any time with 'X' in top right
- Progress indicator shows steps (e.g., "Step 2 of 4")
- Mobile-responsive design

## Step-by-Step Flow

### Step 1: Email Capture
**Design:**
- Clean, full-screen modal overlay
- Subtle gradient background
- Large, clear email input field
- Progress indicator (1/4)

**Content:**
- Headline: "Join the Waitlist"
- Subheadline: "Start your CGM journey with a community that cares"
- Input field: "Your email address"
- CTA: "Continue"

### Step 2: Team Selection
**Design:**
- Card-based layout
- Icon for each team
- Hover states with additional info
- Progress indicator (2/4)

**Content:**
Teams displayed as cards:

1. **Weight Management Team**
   - Icon: Scale or downward trend graph
   - Headline: "Weight Management"
   - Goal: "Keep glucose below [threshold] mg/dL"
   - Description: "Join others focused on sustainable weight management through glucose control"
   - Status: "Currently Accepting Members"

2. **Performance Athletes Team**
   - Icon: Running figure or medal
   - Headline: "Performance Athletes"
   - Goal: "Optimize glucose for peak performance"
   - Description: "For athletes looking to leverage CGM data for better training"
   - Status: "Coming Soon"

3. **Women's Health Team**
   - Icon: Heart or wellness symbol
   - Headline: "Women's Health"
   - Goal: "Balance hormones through glucose control"
   - Description: "Support for women focusing on hormonal health"
   - Status: "Coming Soon"

4. **Metabolic Health Team**
   - Icon: Metabolism or energy symbol
   - Headline: "Metabolic Health"
   - Goal: "Maintain stable glucose levels"
   - Description: "Focus on overall metabolic optimization"
   - Status: "Coming Soon"

### Step 3: CGM Selection
**Design:**
- Radio button or card selection
- Clear grouping of options
- Progress indicator (3/4)

**Content:**
- Headline: "Which CGM do you use?"
- Options:
  • Signos
  • Nutrisense
  • Levels
  • Dexcom Stelo
  • Abbott Lingo
  • Other
  • "I need help choosing a CGM" (links to consultation)

**Visual Design:**
- Each option as a selectable card
- Logo/icon for each provider when available
- Clear visual distinction between options
- Special styling for "I need help choosing" option
- Single selection only

### Step 4: Confirmation
**Design:**
- Celebration animation
- Confetti effect
- Progress indicator (Complete!)

**Content:**
- Headline: "You're on the list! 🎉"
- Subheadline: "We'll notify you when your spot is ready"
- Additional info: "Weight Management team launching first"
- Share options: "Tell your friends"
- Social proof: "Join X others waiting to transform their CGM experience"

## Visual Design Elements

### Typography
- Clean, modern sans-serif
- Clear hierarchy
- Emphasis on readability

### Color Palette
- Primary: Brand colors
- Secondary: Supporting accents
- Success: For confirmation
- Neutral: For backgrounds

### UI Components
- Progress bar or steps indicator
- Clear CTAs
- Easy-to-use form elements
- Smooth transitions between steps
- Close button consistently placed

### Animations
- Subtle transitions between steps
- Celebration animation on completion
- Hover states for interactive elements
- Loading states for submissions

## Error States
- Email validation
- Required field notifications
- Submission failure handling
- Recovery options

## Success Metrics
- Completion rate
- Time to complete
- Drop-off points
- Team selection distribution
- CGM provider distribution