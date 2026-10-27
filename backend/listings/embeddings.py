import hashlib
import numpy as np

# Cache sentence-transformer model in memory if installed
_model = None


def get_embedding_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception:
            _model = False
    return _model if _model is not False else None


def generate_embedding(text: str) -> list[float]:
    """
    Generates a 384-dimensional dense vector for semantic search.
    Uses sentence-transformers 'all-MiniLM-L6-v2' when available,
    with a deterministic normalized hashing fallback.
    """
    if not text:
        return [0.0] * 384

    model = get_embedding_model()
    if model:
        try:
            vector = model.encode(text, normalize_embeddings=True)
            return vector.tolist()
        except Exception:
            pass

    # Deterministic fallback vector of dimension 384
    h = hashlib.sha256(text.encode('utf-8')).digest()
    np.random.seed(int.from_bytes(h[:4], 'little'))
    vec = np.random.randn(384)
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec.tolist()


CATEGORY_KEYWORDS = {
    'Textbooks': [
        'book', 'textbook', 'novel', 'notes', 'study', 'exam', 'edition',
        'madhuku', 'law', 'accounting', 'math', 'chemistry', 'biology', 'stats', 'stat',
        'syllabus', 'course', 'author'
    ],
    'Electronics': [
        'calculator', 'casio', 'phone', 'laptop', 'charger', 'iphone', 'samsung',
        'lenovo', 'hp', 'dell', 'macbook', 'earbuds', 'headphones', 'screen',
        'powerbank', 'usb', 'cable', 'battery', 'hard drive', 'flash drive', 'ram', 'pc'
    ],
    'Clothing': [
        'jacket', 'hoodie', 'shirt', 'pants', 'jeans', 'shoes', 'sneakers',
        'varsity', 'dress', 'tshirt', 'boots', 'blazer', 'suit', 'uniform',
        'sweater', 'coat', 'sandals', 'heels'
    ],
    'Services': [
        'printing', 'typing', 'laundry', 'tutoring', 'haircut', 'plaiting',
        'braiding', 'repair', 'photography', 'design', 'assignments', 'lessons',
        'delivery', 'catering'
    ]
}


def suggest_category(text: str) -> str:
    """
    Keyword and token frequency heuristic for instant category suggestion.
    """
    lowered = text.lower()
    scores = {cat: 0 for cat in CATEGORY_KEYWORDS}

    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in lowered:
                scores[cat] += 2 if len(kw) > 4 else 1

    best_cat = max(scores, key=scores.get)
    return best_cat if scores[best_cat] > 0 else 'Services'
