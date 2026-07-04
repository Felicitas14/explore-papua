import sqlite3
import os

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'papua_tourism.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create Destinations Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS destinations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_id TEXT NOT NULL,
        name_en TEXT NOT NULL,
        region TEXT NOT NULL,
        description_id TEXT NOT NULL,
        description_en TEXT NOT NULL,
        rating REAL NOT NULL,
        image_url TEXT NOT NULL,
        coords_x REAL NOT NULL,
        coords_y REAL NOT NULL
    )
    ''')

    # Create Culture Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS culture (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_id TEXT NOT NULL,
        name_en TEXT NOT NULL,
        category TEXT NOT NULL,
        description_id TEXT NOT NULL,
        description_en TEXT NOT NULL,
        image_url TEXT NOT NULL
    )
    ''')

    # Create Food Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS food (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_id TEXT NOT NULL,
        name_en TEXT NOT NULL,
        description_id TEXT NOT NULL,
        description_en TEXT NOT NULL,
        story_id TEXT NOT NULL,
        story_en TEXT NOT NULL,
        image_url TEXT NOT NULL
    )
    ''')

    # Create Leaderboard Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT NOT NULL,
        score INTEGER NOT NULL,
        badges TEXT NOT NULL,
        date_played DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    conn.commit()
    seed_data(conn)
    conn.close()

def seed_data(conn):
    cursor = conn.cursor()

    # Check if destinations is already seeded
    cursor.execute("SELECT count(*) FROM destinations")
    if cursor.fetchone()[0] > 0:
        return  # Already seeded

    # --- Seed Destinations ---
    destinations = [
        (
            "Raja Ampat", "Raja Ampat", "Raja Ampat",
            "Kepulauan Raja Ampat adalah surga tropis di ujung barat Papua, terkenal dengan keanekaragaman hayati laut terkaya di dunia, terumbu karang yang megah, dan gugusan pulau karst yang menakjubkan.",
            "Raja Ampat Islands are a tropical paradise on the western tip of Papua, world-renowned for the richest marine biodiversity, magnificent coral reefs, and breathtaking karst island clusters.",
            4.9, "/static/images/raja_ampat_hero.png", 10.0, 20.0
        ),
        (
            "Danau Paniai", "Lake Paniai", "Nabire",
            "Danau Paniai menawarkan keindahan alam yang tenang dengan perairan biru jernih yang dikelilingi oleh pegunungan hijau yang megah di ketinggian 1.700 meter di atas permukaan laut.",
            "Lake Paniai offers serene natural beauty with crystal clear blue waters surrounded by majestic green mountains at an altitude of 1,700 meters above sea level.",
            4.7, "/static/images/baliem_valley_hero.png", 35.0, 48.0
        ),
        (
            "Pantai Nabire", "Nabire Beach", "Nabire",
            "Terletak di pusat kota Nabire, pantai ini terkenal dengan pemandangan matahari terbenam yang memukau dan pasir hitam eksotisnya yang menghadap langsung ke Teluk Cenderawasih.",
            "Located in the center of Nabire, this beach is famous for its stunning sunset views and exotic black sands directly facing the Cenderawasih Bay.",
            4.5, "/static/images/cenderawasih_bay_hero.png", 42.0, 40.0
        ),
        (
            "Lembah Baliem", "Baliem Valley", "Wamena",
            "Terletak jauh di Pegunungan Jayawijaya, Lembah Baliem adalah rumah bagi suku Dani yang menjaga tradisi leluhur mereka, dikelilingi oleh pemandangan pegunungan yang dramatis.",
            "Deep in the Jayawijaya Mountains, the Baliem Valley is home to the Dani tribe who maintain their ancestral traditions, surrounded by dramatic mountain landscapes.",
            4.8, "/static/images/baliem_valley_hero.png", 62.0, 58.0
        ),
        (
            "Teluk Cenderawasih", "Cenderawasih Bay", "Jayapura",
            "Taman Nasional Laut terbesar di Indonesia, terkenal sebagai habitat hiu paus jinak di mana pengunjung dapat berenang bersama raksasa laut yang lembut ini.",
            "The largest Marine National Park in Indonesia, famous as the habitat of gentle whale sharks where visitors can swim alongside these gentle giants of the sea.",
            4.9, "/static/images/cenderawasih_bay_hero.png", 46.0, 28.0
        ),
        (
            "Biak", "Biak Island", "Biak",
            "Sebuah pulau bersejarah dengan gua-gua peninggalan Perang Dunia II, dikelilingi oleh pantai pasir putih yang indah dan tempat menyelam yang spektakuler.",
            "A historic island with caves from World War II, surrounded by beautiful white sand beaches and spectacular diving sites.",
            4.6, "/static/images/raja_ampat_hero.png", 50.0, 18.0
        ),
        (
            "Merauke", "Merauke", "Merauke",
            "Titik paling timur Indonesia, terkenal dengan Taman Nasional Wasur yang eksotis dengan bukit rayap raksasa (Musamus) dan padang rumput sabana yang luas.",
            "The easternmost point of Indonesia, famous for the exotic Wasur National Park with its giant termite mounds (Musamus) and vast savannah grasslands.",
            4.6, "/static/images/sunset_boat.png", 88.0, 85.0
        )
    ]
    cursor.executemany('''
    INSERT INTO destinations (name_id, name_en, region, description_id, description_en, rating, image_url, coords_x, coords_y)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', destinations)

    # --- Seed Culture ---
    culture = [
        (
            "Rumah Honai", "Honai House", "Arsitektur",
            "Rumah adat berbentuk lingkaran dengan atap kerucut dari jerami. Didesain tanpa jendela untuk menjaga kehangatan di tengah udara dingin pegunungan Papua.",
            "A traditional circular house with a conical straw roof. Designed without windows to trap warmth amidst the cold mountain air of Papua's highlands.",
            "/static/images/baliem_valley_hero.png"
        ),
        (
            "Rumah Kariwari", "Kariwari House", "Arsitektur",
            "Rumah adat suku Tobati-Enggros di Teluk Yotefa, Jayapura. Memiliki atap kerucut segi delapan bertingkat tiga yang melambangkan hubungan manusia dengan Sang Pencipta.",
            "Traditional house of the Tobati-Enggros tribe in Yotefa Bay, Jayapura. Featuring an octagonal three-tiered roof symbolizing the connection between humans and the Creator.",
            "/static/images/raja_ampat_hero.png"
        ),
        (
            "Tari Yospan", "Yospan Dance", "Kesenian",
            "Tarian pergaulan persahabatan rakyat Papua yang menggabungkan gerakan dinamis dan lincah, sering ditarikan dalam menyambut tamu kehormatan.",
            "A social dance of friendship among the Papuan people, combining dynamic and energetic movements, often performed to welcome honored guests.",
            "/static/images/yospan_dance.png"
        ),
        (
            "Alat Musik Tifa", "Tifa Instrument", "Alat Musik",
            "Alat musik perkusi khas Papua sejenis gendang berbentuk jam pasir yang terbuat dari kayu berukir dan kulit binatang, menghasilkan suara ketukan yang magis.",
            "A traditional Papuan percussion instrument similar to an hourglass drum, crafted from carved wood and animal hide, producing a magical rhythmic beat.",
            "/static/images/tifa.png"
        ),
        (
            "Koteka & Sali", "Traditional Clothing", "Busana",
            "Koteka adalah pakaian penutup tubuh pria dari labu air kering khas pegunungan, sementara Sali adalah rok tradisional wanita yang terbuat dari rajutan serat kulit kayu.",
            "Koteka is a male body sheath made of dried gourd from the highlands, while Sali is a traditional female skirt woven from inner tree bark fibers.",
            "/static/images/yospan_dance.png"
        ),
        (
            "Upacara Bakar Batu", "Bakar Batu Ceremony", "Tradisi",
            "Ritual memasak bersama menggunakan batu membara untuk merayakan rasa syukur, perdamaian antar suku, atau menyambut tamu penting secara kekeluargaan.",
            "A communal cooking ritual using hot stones to celebrate gratitude, peace between tribes, or to welcome important guests in a warm family gathering.",
            "/static/images/baliem_valley_hero.png"
        )
    ]
    cursor.executemany('''
    INSERT INTO culture (name_id, name_en, category, description_id, description_en, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', culture)

    # --- Seed Food ---
    food = [
        (
            "Papeda", "Papeda",
            "Makanan pokok tradisional Papua berupa bubur sagu bertekstur kenyal, lembut, dan lengket. Kaya karbohidrat sehat dan bebas gluten.",
            "A traditional Papuan staple food consisting of chewy, smooth, and sticky sago starch congee. Rich in healthy carbohydrates and gluten-free.",
            "Papeda adalah simbol persatuan dan kebersamaan keluarga di Papua, disajikan dalam wadah besar dan dimakan bersama menggunakan sumpit kayu khusus.",
            "Papeda is a symbol of unity and family togetherness in Papua, served in a large wooden bowl and eaten together using special wooden sticks.",
            "/static/images/papeda.png"
        ),
        (
            "Ikan Kuah Kuning", "Yellow Fish Soup",
            "Sup ikan tongkol atau kakap yang dimasak dengan kuah kuning rempah kunyit, daun kemangi, dan jeruk nipis. Memiliki rasa gurih, asam, dan segar.",
            "Mackerel or snapper soup cooked in yellow turmeric broth, basil leaves, and lime juice. It offers a savory, sour, and refreshingly vibrant flavor profile.",
            "Sajian pendamping wajib untuk Papeda. Kuah rempahnya yang kaya memberikan kehangatan dan rasa gurih yang menyeimbangkan rasa tawar dari sagu.",
            "The mandatory companion for Papeda. Its rich herbal broth offers warmth and a savory flavor that balances the plain taste of the sago.",
            "/static/images/papeda.png"
        ),
        (
            "Sagu Lempeng", "Sagu Lempeng",
            "Roti sagu panggang berbentuk lempengan persegi panjang keras, biasanya berwarna cokelat kemerahan. Tahan lama dan sangat renyah.",
            "Baked sago bread in hard rectangular slabs, typically reddish-brown. Long-lasting and extremely crunchy, perfect with tea.",
            "Camilan bepergian bagi suku-suku pedalaman Papua karena sifatnya yang awet berbulan-bulan, melambangkan ketahanan pangan lokal.",
            "A traveling snack for inland Papuan tribes due to its ability to last for months, representing local food resilience.",
            "/static/images/sunset_boat.png"
        ),
        (
            "Ulat Sagu", "Sago Grubs",
            "Ulat dari pohon sagu yang membusuk, kaya protein tinggi dan asam lemak esensial. Biasanya dipanggang seperti sate atau dimakan mentah.",
            "Nutrient-dense grubs harvested from decaying sago trunks, rich in protein and essential fatty acids. Often grilled on skewers or eaten raw.",
            "Makanan kehormatan dan sumber energi alami yang diwariskan turun-temurun untuk kesehatan fisik masyarakat adat Papua.",
            "An honorable delicacy and natural source of energy passed down through generations to sustain the physical health of indigenous Papuans.",
            "/static/images/cenderawasih_bay_hero.png"
        ),
        (
            "Keladi Tumbuk", "Mashed Taro",
            "Keledek atau keladi yang direbus lalu ditumbuk halus bersama kelapa parut dan sedikit garam, menghasilkan tektur padat dan rasa gurih manis.",
            "Boiled taro root mashed smoothly with grated coconut and a pinch of salt, producing a dense texture with a mild sweet-savory taste.",
            "Sajian karbohidrat alternatif pengganti nasi yang disajikan dalam upacara adat kecil sebagai wujud rasa syukur atas hasil bumi.",
            "An alternative carbohydrate dish replacing rice, served during small traditional ceremonies as an expression of gratitude for the harvest.",
            "/static/images/baliem_valley_hero.png"
        )
    ]
    cursor.executemany('''
    INSERT INTO food (name_id, name_en, description_id, description_en, story_id, story_en, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', food)

    # --- Seed Leaderboard ---
    leaderboard = [
        ("Neles", 95, "Papua Expert", "2026-07-01 10:00:00"),
        ("Martha", 80, "Explorer", "2026-07-02 12:30:00"),
        ("Sitorus", 70, "Beginner", "2026-07-03 14:15:00")
    ]
    cursor.executemany('''
    INSERT INTO leaderboard (player_name, score, badges, date_played)
    VALUES (?, ?, ?, ?)
    ''', leaderboard)

    conn.commit()

if __name__ == '__main__':
    print("Initializing database...")
    init_db()
    print("Database initialized and seeded successfully!")
