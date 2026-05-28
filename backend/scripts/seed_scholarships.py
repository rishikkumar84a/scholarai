"""Seed database with 50 scholarships and their vector embeddings."""

import asyncio
import os
import sys
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

# Add project root to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.db.supabase_client import get_supabase_client
from backend.utils.embeddings import embed_text

SCHOLARSHIPS = [
    {
        "name": "Fulbright Foreign Student Program",
        "description": "Enables graduate students, young professionals, and artists from abroad to study and conduct research in the US.",
        "country": "USA",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.0,
        "deadline": "2026-10-15",
        "link": "https://foreign.fulbrightonline.org/"
    },
    {
        "name": "Chevening Scholarship",
        "description": "UK government's global scholarship programme, funded by the FCDO and partner organisations, offering fully-funded master's degrees.",
        "country": "UK",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.0,
        "deadline": "2026-11-01",
        "link": "https://www.chevening.org/"
    },
    {
        "name": "DAAD Scholarship",
        "description": "Scholarships for international students to study in Germany, particularly for master's and PhD programs.",
        "country": "Germany",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.0,
        "deadline": "2026-12-01",
        "link": "https://www.daad.de/"
    },
    {
        "name": "MEXT Scholarship",
        "description": "Japanese government scholarships for international students who wish to study in graduate courses at Japanese universities.",
        "country": "Japan",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.2,
        "deadline": "2026-05-30",
        "link": "https://www.mext.go.jp/"
    },
    {
        "name": "Eiffel Excellence Scholarship",
        "description": "Established by the French Ministry for Europe and Foreign Affairs to enable French higher education institutions to attract top foreign students.",
        "country": "France",
        "degree_level": "masters",
        "field": "Engineering, Science, Management",
        "gpa_requirement": 3.5,
        "deadline": "2027-01-10",
        "link": "https://www.campusfrance.org/"
    },
    {
        "name": "Gates Cambridge Scholarship",
        "description": "Full-cost scholarships for outstanding applicants from outside the UK to pursue a full-time postgraduate degree at Cambridge.",
        "country": "UK",
        "degree_level": "phd",
        "field": "All Fields",
        "gpa_requirement": 3.8,
        "deadline": "2026-10-11",
        "link": "https://www.gatescambridge.org/"
    },
    {
        "name": "Knight-Hennessy Scholars",
        "description": "Develops a community of future global leaders to address complex challenges through collaboration and innovation at Stanford University.",
        "country": "USA",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.7,
        "deadline": "2026-10-09",
        "link": "https://knight-hennessy.stanford.edu/"
    },
    {
        "name": "Rhodes Scholarship",
        "description": "The oldest and perhaps most prestigious international scholarship programme, enabling outstanding young people from around the world to study at Oxford.",
        "country": "UK",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.8,
        "deadline": "2026-08-01",
        "link": "https://www.rhodeshouse.ox.ac.uk/"
    },
    {
        "name": "Schwarzman Scholars",
        "description": "Designed to prepare the next generation of global leaders, giving them the world's best master's degree in global affairs at Tsinghua University.",
        "country": "China",
        "degree_level": "masters",
        "field": "Global Affairs",
        "gpa_requirement": 3.5,
        "deadline": "2026-09-12",
        "link": "https://www.schwarzmanscholars.org/"
    },
    {
        "name": "Swiss Government Excellence Scholarships",
        "description": "Aimed at young researchers from abroad who have completed a master's degree or PhD.",
        "country": "Switzerland",
        "degree_level": "phd",
        "field": "All Fields",
        "gpa_requirement": 3.5,
        "deadline": "2026-11-15",
        "link": "https://www.sbfi.admin.ch/"
    },
    {
        "name": "Australian Awards Scholarships",
        "description": "Provide opportunities for people from developing countries to undertake full-time undergraduate or postgraduate study at participating Australian universities.",
        "country": "Australia",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.0,
        "deadline": "2026-04-30",
        "link": "https://www.dfat.gov.au/people-to-people/australia-awards"
    },
    {
        "name": "Vanier Canada Graduate Scholarships",
        "description": "Helps Canadian institutions attract highly qualified doctoral students.",
        "country": "Canada",
        "degree_level": "phd",
        "field": "Health, Natural Sciences, Engineering, Social Sciences, Humanities",
        "gpa_requirement": 3.7,
        "deadline": "2026-11-01",
        "link": "https://vanier.gc.ca/"
    },
    {
        "name": "Banting Postdoctoral Fellowships",
        "description": "Provides funding to the very best postdoctoral applicants, both nationally and internationally, who will positively contribute to the country's economic, social, and research-based growth.",
        "country": "Canada",
        "degree_level": "postdoc",
        "field": "Health, Natural Sciences, Engineering, Social Sciences, Humanities",
        "gpa_requirement": 3.8,
        "deadline": "2026-09-20",
        "link": "https://banting.fellowships-bourses.gc.ca/"
    },
    {
        "name": "Joint Japan World Bank Graduate Scholarship",
        "description": "For professionals from developing countries to pursue a master's degree in a development-related topic.",
        "country": "USA",
        "degree_level": "masters",
        "field": "Development Studies",
        "gpa_requirement": 3.0,
        "deadline": "2026-02-28",
        "link": "https://www.worldbank.org/"
    },
    {
        "name": "Rotary Peace Fellowships",
        "description": "Fully funded fellowships for leaders to study peace and conflict resolution.",
        "country": "Multiple",
        "degree_level": "masters",
        "field": "Peace and Conflict Resolution",
        "gpa_requirement": 3.0,
        "deadline": "2026-05-15",
        "link": "https://www.rotary.org/"
    },
    {
        "name": "Aga Khan Foundation Scholarship",
        "description": "Provides a limited number of scholarships each year for postgraduate studies to outstanding students from developing countries.",
        "country": "Multiple",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.5,
        "deadline": "2026-03-31",
        "link": "https://www.akdn.org/"
    },
    {
        "name": "OPEC Fund Scholarship Award",
        "description": "For applicants from developing countries to pursue graduate studies in a development-related field.",
        "country": "Multiple",
        "degree_level": "masters",
        "field": "Development Studies",
        "gpa_requirement": 3.0,
        "deadline": "2026-05-08",
        "link": "https://opecfund.org/"
    },
    {
        "name": "Commonwealth Master's Scholarships",
        "description": "For candidates from low and middle-income Commonwealth countries to undertake full-time master's study at a UK university.",
        "country": "UK",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.2,
        "deadline": "2026-10-18",
        "link": "https://cscuk.fcdo.gov.uk/"
    },
    {
        "name": "Erasmus Mundus Joint Master Degrees",
        "description": "Prestigious, integrated, international study programmes, jointly delivered by an international consortium of higher education institutions.",
        "country": "Europe",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.0,
        "deadline": "2027-01-30",
        "link": "https://erasmus-plus.ec.europa.eu/"
    },
    {
        "name": "Clarendon Scholarships at University of Oxford",
        "description": "A major graduate scholarship scheme at the University of Oxford, offering around 160 new scholarships every year.",
        "country": "UK",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.8,
        "deadline": "2027-01-10",
        "link": "https://www.ox.ac.uk/clarendon"
    },
    {
        "name": "Edinburgh Global Research Scholarships",
        "description": "Awarded to overseas students undertaking a research degree at the University of Edinburgh.",
        "country": "UK",
        "degree_level": "phd",
        "field": "All Fields",
        "gpa_requirement": 3.5,
        "deadline": "2027-02-01",
        "link": "https://www.ed.ac.uk/"
    },
    {
        "name": "Bologna University Study Grants",
        "description": "For international students enrolling in First, Single, and Second Cycle Degree Programmes at the University of Bologna.",
        "country": "Italy",
        "degree_level": "bachelors",
        "field": "All Fields",
        "gpa_requirement": 3.0,
        "deadline": "2026-04-30",
        "link": "https://www.unibo.it/"
    },
    {
        "name": "Lund University Global Scholarship",
        "description": "Targeted at top academic students who are citizens of countries from outside the European Union/European Economic Area.",
        "country": "Sweden",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.5,
        "deadline": "2027-01-15",
        "link": "https://www.lunduniversity.lu.se/"
    },
    {
        "name": "Utrecht Excellence Scholarships",
        "description": "Offers a number of outstanding prospective students the opportunity to pursue a Bachelor's or Master's degree in a selected number of fields at Utrecht University.",
        "country": "Netherlands",
        "degree_level": "masters",
        "field": "Selected Fields",
        "gpa_requirement": 3.7,
        "deadline": "2027-01-31",
        "link": "https://www.uu.nl/"
    },
    {
        "name": "Amsterdam Excellence Scholarships",
        "description": "Awards scholarships to exceptionally talented students from outside Europe to pursue eligible Master's Programmes at the University of Amsterdam.",
        "country": "Netherlands",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.8,
        "deadline": "2027-01-15",
        "link": "https://www.uva.nl/"
    },
    {
        "name": "Radboud Scholarship Programme",
        "description": "Offers a select number of talented prospective non-EEA students the opportunity to receive a scholarship to pursue a complete English-taught Master's degree programme at Radboud University.",
        "country": "Netherlands",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.5,
        "deadline": "2027-02-28",
        "link": "https://www.ru.nl/"
    },
    {
        "name": "Maastricht University Holland-High Potential Scholarship",
        "description": "Offers highly talented students from outside the EU/EEA the opportunity to follow a Master's degree programme at Maastricht University.",
        "country": "Netherlands",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.5,
        "deadline": "2027-02-01",
        "link": "https://www.maastrichtuniversity.nl/"
    },
    {
        "name": "TU Delft Excellence Scholarships",
        "description": "For excellent international applicants admitted to one of TU Delft's MSc programmes.",
        "country": "Netherlands",
        "degree_level": "masters",
        "field": "Engineering, Technology",
        "gpa_requirement": 3.8,
        "deadline": "2026-12-01",
        "link": "https://www.tudelft.nl/"
    },
    {
        "name": "Aalto University Scholarship Programme",
        "description": "Seeks to recognise talented non-EU/EEA students. Scholarships are awarded on the basis of academic excellence.",
        "country": "Finland",
        "degree_level": "masters",
        "field": "Art, Design, Architecture, Business, Technology",
        "gpa_requirement": 3.5,
        "deadline": "2027-01-04",
        "link": "https://www.aalto.fi/"
    },
    {
        "name": "Oulu International Scholarships",
        "description": "For international students applying for the Master's programmes at the University of Oulu.",
        "country": "Finland",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.0,
        "deadline": "2027-01-18",
        "link": "https://www.oulu.fi/"
    },
    {
        "name": "University of Oslo Scholarships",
        "description": "Various scholarships available for international students pursuing a master's degree at the University of Oslo.",
        "country": "Norway",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.5,
        "deadline": "2026-12-01",
        "link": "https://www.uio.no/"
    },
    {
        "name": "Danish Government Scholarships",
        "description": "For highly qualified non-EU/EEA students applying for a full degree higher education programme in Denmark.",
        "country": "Denmark",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.5,
        "deadline": "2026-09-01",
        "link": "https://studyindenmark.dk/"
    },
    {
        "name": "Swedish Institute Scholarships for Global Professionals",
        "description": "Aims at developing future global leaders that will contribute to the United Nations 2030 Agenda for Sustainable Development.",
        "country": "Sweden",
        "degree_level": "masters",
        "field": "Sustainable Development",
        "gpa_requirement": 3.0,
        "deadline": "2027-02-28",
        "link": "https://si.se/"
    },
    {
        "name": "VLIR-UOS Training and Masters Scholarships",
        "description": "Awards scholarships to students from 31 eligible countries in Africa, Asia, and Latin America to attend a training or master's programme taught in English at a Flemish university or university college in Belgium.",
        "country": "Belgium",
        "degree_level": "masters",
        "field": "Development Studies",
        "gpa_requirement": 3.0,
        "deadline": "2027-02-01",
        "link": "https://www.vliruos.be/"
    },
    {
        "name": "KU Leuven Science Scholarships",
        "description": "For talented international students who have been preselected to apply for an eligible Master's programme at the Faculty of Science of KU Leuven.",
        "country": "Belgium",
        "degree_level": "masters",
        "field": "Science",
        "gpa_requirement": 3.5,
        "deadline": "2027-02-15",
        "link": "https://wet.kuleuven.be/"
    },
    {
        "name": "ENS International Selection",
        "description": "Every year, ENS organizes an international selection allowing the most promising international students, either in Science or in Humanities, to follow a three-year Masters Degree at the University.",
        "country": "France",
        "degree_level": "masters",
        "field": "Science, Humanities",
        "gpa_requirement": 3.8,
        "deadline": "2026-12-09",
        "link": "https://www.ens.psl.eu/"
    },
    {
        "name": "Emile Boutmy Scholarships at Sciences Po",
        "description": "Created to welcome the very best international students from outside the European Union.",
        "country": "France",
        "degree_level": "bachelors",
        "field": "Social Sciences",
        "gpa_requirement": 3.5,
        "deadline": "2027-02-28",
        "link": "https://www.sciencespo.fr/"
    },
    {
        "name": "Ampere Scholarships of Excellence at ENS de Lyon",
        "description": "Provides talented international students with the opportunity to enroll in its Masters programs in the Exact Sciences, the Arts, and the Human and Social Sciences.",
        "country": "France",
        "degree_level": "masters",
        "field": "Science, Arts, Humanities",
        "gpa_requirement": 3.5,
        "deadline": "2027-01-15",
        "link": "https://www.ens-lyon.fr/"
    },
    {
        "name": "Université Paris-Saclay International Master's Scholarships",
        "description": "Aims to promote access to its master's programs to international students, taught in its member establishments.",
        "country": "France",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.5,
        "deadline": "2026-05-15",
        "link": "https://www.universite-paris-saclay.fr/"
    },
    {
        "name": "ETH Zurich Excellence Master's Scholarship",
        "description": "Supports outstanding students who wish to pursue a Master's degree at ETH Zurich.",
        "country": "Switzerland",
        "degree_level": "masters",
        "field": "Science, Technology, Engineering, Mathematics",
        "gpa_requirement": 3.8,
        "deadline": "2026-12-15",
        "link": "https://ethz.ch/"
    },
    {
        "name": "UNIL Master's Grants",
        "description": "The University of Lausanne offers around ten grants to foreign students who have graduated from a foreign university and wish to pursue a Master's degree at UNIL.",
        "country": "Switzerland",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.5,
        "deadline": "2026-11-01",
        "link": "https://www.unil.ch/"
    },
    {
        "name": "University of Geneva Excellence Master Fellowships",
        "description": "The Faculty of Science of the University of Geneva offers an Excellence Fellowship program to support outstanding and highly motivated candidates who intend to pursue a Master of Science.",
        "country": "Switzerland",
        "degree_level": "masters",
        "field": "Science",
        "gpa_requirement": 3.8,
        "deadline": "2027-02-28",
        "link": "https://www.unige.ch/"
    },
    {
        "name": "Singapore International Graduate Award (SINGA)",
        "description": "An award given to international students with excellent academic undergraduate and/or master's results, and strong interest in doing research leading to a doctorate (PhD) in Science and Engineering at a Singapore University.",
        "country": "Singapore",
        "degree_level": "phd",
        "field": "Science, Engineering",
        "gpa_requirement": 3.5,
        "deadline": "2026-12-01",
        "link": "https://www.a-star.edu.sg/"
    },
    {
        "name": "Nanyang President's Graduate Scholarship",
        "description": "A competitive and prestigious scholarship scheme designed to encourage outstanding graduates or final-year students to take their first step towards a leading research career by studying for a full-time PhD at NTU.",
        "country": "Singapore",
        "degree_level": "phd",
        "field": "All Fields",
        "gpa_requirement": 3.8,
        "deadline": "2026-12-31",
        "link": "https://www.ntu.edu.sg/"
    },
    {
        "name": "NUS Research Scholarship",
        "description": "Awarded to outstanding graduates for research leading to a higher degree at the National University of Singapore.",
        "country": "Singapore",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.5,
        "deadline": "2026-11-15",
        "link": "https://www.nus.edu.sg/"
    },
    {
        "name": "Hong Kong PhD Fellowship Scheme",
        "description": "Aims to attract the best and brightest students in the world to pursue their PhD studies in Hong Kong's universities.",
        "country": "Hong Kong",
        "degree_level": "phd",
        "field": "All Fields",
        "gpa_requirement": 3.5,
        "deadline": "2026-12-01",
        "link": "https://cerg1.ugc.edu.hk/"
    },
    {
        "name": "TaiwanICDF Higher Education Scholarship Program",
        "description": "Provides scholarships for higher education and has developed undergraduate, graduate, and PhD programs in cooperation with renowned partner universities in Taiwan.",
        "country": "Taiwan",
        "degree_level": "bachelors",
        "field": "All Fields",
        "gpa_requirement": 3.0,
        "deadline": "2026-03-15",
        "link": "https://www.icdf.org.tw/"
    },
    {
        "name": "Korean Government Scholarship Program",
        "description": "Designed to provide international students with opportunities to study at higher educational institutions in Korea for Bachelor's, Master's, and Doctoral degrees.",
        "country": "South Korea",
        "degree_level": "bachelors",
        "field": "All Fields",
        "gpa_requirement": 3.0,
        "deadline": "2026-03-01",
        "link": "https://www.studyinkorea.go.kr/"
    },
    {
        "name": "Global Korea Scholarship",
        "description": "Designed to provide international students with opportunities to study at higher educational institutions in Korea.",
        "country": "South Korea",
        "degree_level": "masters",
        "field": "All Fields",
        "gpa_requirement": 3.0,
        "deadline": "2026-03-01",
        "link": "https://www.studyinkorea.go.kr/"
    },
    {
        "name": "Turkish Government Scholarships",
        "description": "A government-funded, competitive scholarship program, awarded to outstanding students and researchers to pursue full-time or short-term programs at the top universities in Turkey.",
        "country": "Turkey",
        "degree_level": "bachelors",
        "field": "All Fields",
        "gpa_requirement": 3.0,
        "deadline": "2026-02-20",
        "link": "https://turkiyeburslari.gov.tr/"
    }
]


async def process_scholarship(s, supabase):
    text = f"{s['name']}. {s['description']} Country: {s['country']}, Level: {s['degree_level']}, Field: {s['field']}"
    # Convert string fields to list before inserting
    if isinstance(s.get("degree_level"), str):
        s["degree_level"] = [s["degree_level"]]
    if isinstance(s.get("field"), str):
        s["field"] = [s["field"]]
        
    print(f"Generating embedding for: {s['name']}")
    try:
        embedding = await asyncio.to_thread(embed_text, text)
        s["embedding"] = embedding
        
        # Insert into DB
        print(f"Inserting into Supabase: {s['name']}")
        await asyncio.to_thread(lambda: supabase.table("scholarships").insert(s).execute())
    except Exception as e:
        print(f"Error processing {s['name']}: {e}")

async def main():
    print(f"Seeding {len(SCHOLARSHIPS)} scholarships...")
    try:
        supabase = get_supabase_client("service")
    except Exception as e:
        print(f"Failed to get Supabase client: {e}")
        return

    # Delete existing scholarships to avoid duplicates
    try:
        print("Clearing existing scholarships...")
        # A simple hack to delete all rows since we can't do .delete() without a filter easily in Python client sometimes
        # We'll filter where id is not null.
        supabase.table("scholarships").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    except Exception as e:
        print(f"Could not clear scholarships: {e}")
        # Proceed anyway

    tasks = [process_scholarship(s, supabase) for s in SCHOLARSHIPS]
    await asyncio.gather(*tasks)
    
    print("Seeding complete.")

if __name__ == "__main__":
    asyncio.run(main())
