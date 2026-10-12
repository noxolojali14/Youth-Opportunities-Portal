# Youth Opportunities Portal

A mobile-first website that brings verified jobs, internships, learnerships, bursaries and courses for young South Africans together in one accessible place.

**Live site:** https://noxolojali14.github.io/Youth-Opportunities-Portal/

## Problem Statement

Young people search across many websites, social media platforms and informal channels for opportunities. That information is often hard to find, outdated, unclear about requirements, difficult to use on mobile, or not verified.

## Target Users

- Young job seekers, students and recent graduates
- People looking for learnerships, internships, bursaries or skills programmes
- Community organisations sharing verified opportunities

## User Stories

- As a job seeker, I want to search by keyword so that I can quickly find relevant opportunities.
- As a student, I want to filter by category, location, experience level and closing date so that I only see opportunities that suit me.
- As an applicant, I want to see the eligibility, requirements, documents and deadline so that I can prepare a complete application.
- As an applicant, I want a link to the official listing so that I apply through the correct channel.
- As a user, I want to report expired or suspicious listings so that the portal stays trustworthy.
- As a first-time job seeker, I want CV, interview and scam-awareness guidance so that I can apply with confidence.

## Pages

| Page | Purpose |
|------|---------|
| Home | Introduction, search, categories, featured opportunities, upcoming deadlines, career resources and calls to action |
| About | Mission, target users, how the portal works and responsible-content notes |
| Opportunities | Searchable and filterable opportunity cards |
| Opportunity Details | Description, eligibility, qualifications, documents, deadline, how to apply, organisation and official link |
| Career Resources | CV, interviews, professional profile, cover letters, scams and application documents |
| Contact & Report | Enquiries, expired or incorrect listing reports, opportunity suggestions and platform feedback |

## Implemented Features

- Keyword search, plus category, location, experience-level and closing-date filters
- Sorting by newest, closing soon or A-Z
- Opportunity cards generated dynamically from a structured JSON dataset (`data/opportunities.json`)
- Loading, empty-results and error states
- Contact form validation with clear error and success messages
- Responsive navigation with a mobile menu
- Expired listings are hidden automatically after their closing date
- Sample listings are clearly labelled **SAMPLE LISTING** and have no application link
- Each listing shows the date it was last updated
- Scam warning panel on every page
- Accessibility: semantic HTML, a skip link, alt text, labelled form fields, visible focus states, keyboard support and good colour contrast

## Technologies

HTML5, CSS3 (Flexbox, Grid, media queries), JavaScript, JSON, Git, GitHub and GitHub Pages.

## Running Locally

The site loads data with `fetch`, so serve it over HTTP instead of opening the files directly:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or use the VS Code Live Server extension.

## Responsible Content

- Real listings link only to official employer vacancy notices and show when they were verified.
- Fictional demonstration listings are labelled and have no application link.
- Expired listings are hidden on their closing date and removed from the dataset during regular reviews.
- Users are reminded on every page never to pay to apply.

## Testing

Testing covered:

- Search and each filter, on their own and combined
- The empty-results state
- Expired and missing-listing handling on the details page
- Required-field and email validation on the contact form
- Keyboard navigation
- Layouts at mobile, tablet and desktop widths

## Known Limitations

- The contact form does not send messages; it only demonstrates validation and the confirmation message.
- Listings are kept in a static JSON file and updated manually.
- There are few real listings, so some categories rely on sample data.

## Future Improvements

- Saved opportunities and recently viewed listings using local storage
- Closing-soon labels and deadline countdowns
- A backend and database so organisations can submit listings for review
- Email notifications for new opportunities
