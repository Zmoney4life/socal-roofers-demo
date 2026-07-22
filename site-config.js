window.SITE = {
  "business": {
    "name": "SoCal Roofers",
    "phone": "(909) 963-9450"
  },
  "theme": {
    "primary": "#2563eb",
    "accent": "#ebad25"
  },
  "form": {
    "title": "Book Your Free Roof Inspection",
    "subtitle": "A few quick questions. Then we come out and look at your roof for free.",
    "submitLabel": "Get My Free Inspection",
    "reassurance": "No obligation \u00b7 Free inspection \u00b7 Certified & insured",
    "address": {
      "provider": "google",
      "apiKey": "AIzaSyCi3_NlHygTAgwnsc_RWQD14e_jdzfPNrY",
      "country": [
        "us"
      ],
      "bias": {
        "lat": 33.87,
        "lon": -117.92,
        "radiusMeters": 50000
      }
    },
    "disqualify": {
      "emoji": "\ud83d\udd11",
      "heading": "We work with property owners",
      "body": "Only the owner can approve roof work. Send us to your landlord and we'll take it from there."
    },
    "steps": [
      {
        "type": "choice",
        "field": "roofProblem",
        "q": "What is going on with your roof?",
        "options": [
          {
            "label": "Active leak or water stains",
            "emoji": "\ud83d\udca7"
          },
          {
            "label": "Missing or broken tiles or shingles",
            "emoji": "\u26a0\ufe0f"
          },
          {
            "label": "Roof is just old and worn out",
            "emoji": "\u2600\ufe0f"
          },
          {
            "label": "Planning a full replacement",
            "emoji": "\ud83c\udfe0"
          },
          {
            "label": "Commercial or flat roof",
            "emoji": "\ud83c\udfe2"
          },
          {
            "label": "Not sure, need an inspection",
            "emoji": "\ud83e\udd14"
          }
        ]
      },
      {
        "type": "choice",
        "field": "ownership",
        "q": "Do you own the property?",
        "options": [
          {
            "label": "Yes, I own it",
            "emoji": "\u2705"
          },
          {
            "label": "I manage a commercial property",
            "emoji": "\ud83c\udfe2"
          },
          {
            "label": "I rent",
            "emoji": "\ud83d\udd11",
            "disqualify": true
          }
        ]
      },
      {
        "type": "choice",
        "field": "workType",
        "q": "Repair, replacement, or just an inspection?",
        "options": [
          {
            "label": "Repair",
            "emoji": "\ud83d\udd27"
          },
          {
            "label": "Full replacement",
            "emoji": "\ud83c\udfd7\ufe0f"
          },
          {
            "label": "Just an inspection for now",
            "emoji": "\ud83d\udd0d"
          },
          {
            "label": "Whatever it actually needs",
            "emoji": "\ud83e\udd1d"
          }
        ]
      },
      {
        "type": "choice",
        "field": "timeline",
        "q": "How soon do you need it done?",
        "options": [
          {
            "label": "ASAP, it is leaking now",
            "emoji": "\ud83d\udea8"
          },
          {
            "label": "In the next few weeks",
            "emoji": "\ud83d\udcc5"
          },
          {
            "label": "Within 30 days",
            "emoji": "\ud83d\uddd3\ufe0f"
          },
          {
            "label": "Just planning ahead",
            "emoji": "\ud83e\udded"
          }
        ]
      },
      {
        "type": "text",
        "field": "propertyAddress",
        "q": "Property Address",
        "help": "So we can look at your roof on satellite first.",
        "placeholder": "123 Main St, Fullerton, CA",
        "autocomplete": true
      },
      {
        "type": "choice",
        "field": "callbackTime",
        "q": "Best time to call you?",
        "options": [
          {
            "label": "Morning",
            "emoji": "\ud83c\udf05"
          },
          {
            "label": "Afternoon",
            "emoji": "\ud83c\udf24\ufe0f"
          },
          {
            "label": "Evening",
            "emoji": "\ud83c\udf19"
          }
        ]
      },
      {
        "type": "contact",
        "eyebrow": "Almost Done!",
        "q": "Where should we send your inspection details?",
        "sub": "We'll call to set a time.",
        "phonePlaceholder": "(714) 555-1234"
      }
    ]
  },
  "reviews": [
    {
      "name": "Alana Smith",
      "sub": "Google review",
      "text": "I have had a leak and hired 2 other roofing companies to fix issue and both failed miserably!! SoCal came out identified the issue immediately and it's finally fixed. Communication was outstanding and great follow through. Highly highly recommend!!!"
    },
    {
      "name": "Jasmine De La Torre",
      "sub": "Google review",
      "text": "Very impressed & satisfied with our new roof and the entire process. SoCal Roofers did an amazing job replacing our roof. Looks beautiful and highly recommend!"
    },
    {
      "name": "Jerry Ayala",
      "sub": "Google review",
      "text": "SoCal Roofers provided great service and awesome craftsmanship with replacing my entire roof. Great price, great material, and great team. Thank you Julio."
    }
  ]
};
