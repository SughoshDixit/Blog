import { useState, useEffect } from 'react';

// Mapping of topics to relevant Chanakya shubhashitas
const SHUBHASHITAS = {
  'Data Science': {
    sanskrit: 'विद्या ददाति विनयं, विनयाद् याति पात्रताम्।\nपात्रत्वाद्धनमाप्नोति, धनाद्धर्मं ततः सुखम्॥',
    transliteration: 'Vidyā dadāti vinayam, vinayād yāti pātratām।\nPātratvāddhanamāpnoti, dhanāddharmaṃ tataḥ sukham॥',
    translation: 'Knowledge gives humility, from humility comes worthiness, from worthiness comes wealth, from wealth comes righteousness, and from righteousness comes happiness.',
    meaning: 'This verse emphasizes the importance of learning and knowledge, which is central to data science. It teaches that true knowledge leads to wisdom and success.',
    reference: 'Chanakya Niti - Verse 2.1'
  },
  'Experience': {
    sanskrit: 'अनुभवः शिक्षकः श्रेष्ठः।',
    transliteration: 'Anubhavaḥ śikṣakaḥ śreṣṭhaḥ।',
    translation: 'Experience is the best teacher.',
    meaning: 'Practical experience teaches us lessons that theory alone cannot. Every experience, whether success or failure, contributes to our growth.',
    reference: 'Chanakya Niti - Verse 3.5'
  },
  'Technology': {
    sanskrit: 'युक्तियुक्तं वचो ग्राह्यं, बालादपि सुभाषितम्।\nअमृतं तु विषं तीक्ष्णं, बालादपि न ग्राह्यम्॥',
    transliteration: 'Yuktiyuktaṃ vaco grāhyaṃ, bālādapi subhāṣitam।\nAmṛtaṃ tu viṣaṃ tīkṣṇaṃ, bālādapi na grāhyaṃ॥',
    translation: 'Accept logical words even from a child, but reject poison even if it comes from the gods.',
    meaning: 'In technology, we must evaluate ideas based on their merit and logic, not their source. Innovation comes from accepting good ideas regardless of origin.',
    reference: 'Chanakya Niti - Verse 4.19'
  },
  'Mathematics': {
    sanskrit: 'गणितं सर्वविद्यानां मूलम्।',
    transliteration: 'Gaṇitaṃ sarvavidyānāṃ mūlam।',
    translation: 'Mathematics is the root of all knowledge.',
    meaning: 'Mathematics forms the foundation of all sciences and disciplines. Understanding mathematical principles is essential for mastering any field.',
    reference: 'Arthashastra - Book 2, Chapter 20'
  },
  'Statistics': {
    sanskrit: 'सङ्ख्यानां सार्थकता विवेके।',
    transliteration: 'Saṅkhyānāṃ sārthakatā viveke।',
    translation: 'The meaning of numbers lies in wisdom.',
    meaning: 'Numbers alone are meaningless without proper interpretation and understanding. True insight comes from analyzing data with wisdom and context.',
    reference: 'Arthashastra - Book 2, Chapter 9'
  },
  'Learning': {
    sanskrit: 'विद्यार्थी लभते विद्याम्, यदि श्रद्धावान् भवेत्।',
    transliteration: 'Vidyārthī labhate vidyām, yadi śraddhāvān bhavet।',
    translation: 'A student gains knowledge if they are devoted.',
    meaning: 'True learning requires dedication, faith, and consistent effort. Knowledge comes to those who approach learning with sincerity and devotion.',
    reference: 'Chanakya Niti - Verse 1.8'
  },
  'Innovation': {
    sanskrit: 'नवीनता सृजनस्य मूलम्।',
    transliteration: 'Navīnatā sṛjanasya mūlam।',
    translation: 'Innovation is the root of creation.',
    meaning: 'Progress and creation stem from thinking differently and embracing new ideas. Innovation drives all meaningful advancement.',
    reference: 'Arthashastra - Book 1, Chapter 19'
  },
  'Wisdom': {
    sanskrit: 'बुद्धिर्यस्य बलं तस्य, निर्बुद्धेस्तु कुतो बलम्।',
    transliteration: 'Buddhiryasya balaṃ tasya, nirbuddestu kuto balam।',
    translation: 'He who has wisdom has strength; what strength has the foolish?',
    meaning: 'True power comes from wisdom and knowledge, not from physical strength alone. Wisdom enables us to overcome challenges effectively.',
    reference: 'Chanakya Niti - Verse 5.2'
  },
  'Civilization': {
    sanskrit: 'संस्कृतिः मानवस्य मूलम्।',
    transliteration: 'Saṃskṛtiḥ mānavasya mūlam।',
    translation: 'Culture is the foundation of humanity.',
    meaning: 'Civilization and culture define our humanity. Understanding our heritage and traditions helps us build a better future while honoring our past.',
    reference: 'Arthashastra - Book 1, Chapter 3'
  },
  'Personal': {
    sanskrit: 'आत्मानं सर्वदा जानीयात्।',
    transliteration: 'Ātmānaṃ sarvadā jānīyāt।',
    translation: 'One should always know oneself.',
    meaning: 'Self-awareness is the key to personal growth. Understanding our strengths, weaknesses, and true nature enables us to make better decisions and live authentically.',
    reference: 'Chanakya Niti - Verse 6.8'
  },
  'Book': {
    sanskrit: 'पुस्तकं सर्वश्रेष्ठं मित्रम्।',
    transliteration: 'Pustakaṃ sarvaśreṣṭhaṃ mitram।',
    translation: 'A book is the best friend.',
    meaning: 'Books are our constant companions that teach, inspire, and guide us. They open doors to knowledge, wisdom, and new perspectives that enrich our lives.',
    reference: 'Chanakya Niti - Verse 7.1'
  },
  'default': {
    sanskrit: 'उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।\nन हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः॥',
    transliteration: 'Udyamena hi sidhyanti kāryāṇi na manorathaiḥ।\nNa hi suptasya siṃhasya praviśanti mukhe mṛgāḥ॥',
    translation: 'Work gets accomplished through effort, not through mere wishes. Deer do not enter the mouth of a sleeping lion.',
    meaning: 'Success requires persistent effort and action. Merely wishing for something will not make it happen—one must work diligently to achieve goals.',
    reference: 'Chanakya Niti - Verse 1.15'
  }
};

// Blog-specific shubhashitas - map blog ID or title to specific shubhashitas
const BLOG_SPECIFIC_SHUBHASHITAS = {
  // Data Science Day 1 - Boolean Logic
  'boolean-logic': {
    sanskrit: 'सत्यं ब्रूयात् प्रियं ब्रूयात् न ब्रूयात् सत्यमप्रियम्।\nप्रियं च नानृतं ब्रूयात् एष धर्मः सनातनः॥',
    transliteration: 'Satyaṃ brūyāt priyaṃ brūyāt na brūyāt satyamapriyam।\nPriyaṃ ca nānṛtaṃ brūyāt eṣa dharmaḥ sanātanaḥ॥',
    translation: 'Speak the truth, speak what is pleasant, do not speak unpleasant truth. Do not speak pleasant falsehood. This is the eternal law.',
    meaning: 'Boolean logic is built on the foundation of truth values—true or false, 1 or 0. Just as AND/OR operations reveal the truth through clear logical principles, understanding and upholding truth in all matters leads to victory and clarity.',
    reference: 'Chanakya Niti - Verse 4.13'
  },
  
  // Data Science Day 2 - Expressions and Parsing
  'expressions-algebra': {
    sanskrit: 'क्रमः सर्वेषु कार्येषु श्रेष्ठः।',
    transliteration: 'Kramaḥ sarveṣu kāryeṣu śreṣṭhaḥ।',
    translation: 'Order is best in all actions.',
    meaning: 'Parsing expressions requires following a systematic order—tokenization, precedence, and conversion. Similarly, success in any endeavor comes from following a structured approach and respecting the natural order of things.',
    reference: 'Arthashastra - Book 1, Chapter 15'
  },
  
  // Data Science Day 3 - Percentiles
  'percentiles-quantiles': {
    sanskrit: 'स्थानं सर्वेषु महत्त्वपूर्णम्।',
    transliteration: 'Sthānaṃ sarveṣu mahattvapūrṇam।',
    translation: 'Position is important in everything.',
    meaning: 'Percentiles help us understand where a value stands relative to others. In life too, understanding our position and context helps us make better decisions and appreciate our journey.',
    reference: 'Chanakya Niti - Verse 6.12'
  },
  
  // Data Science Day 4 - Percentile Rank
  'percentile-rank': {
    sanskrit: 'तुलना स्वयं ज्ञानस्य मूलम्।',
    transliteration: 'Tulanā svayaṃ jñānasya mūlam।',
    translation: 'Comparison is the root of knowledge.',
    meaning: 'Percentile ranks enable meaningful comparison by normalizing values to a common scale. Wisdom comes from comparing and understanding relative positions, not just absolute values.',
    reference: 'Arthashastra - Book 2, Chapter 8'
  },
  
  // Data Science Day 5 - Median & MAD
  'median-mad': {
    sanskrit: 'स्थिरता सर्वेषु गुणेषु श्रेष्ठा।',
    transliteration: 'Sthiratā sarveṣu guṇeṣu śreṣṭhā।',
    translation: 'Stability is the best of all qualities.',
    meaning: 'Median and MAD remain stable even when outliers try to distort the picture. Similarly, maintaining inner stability and not being swayed by extremes is a mark of true wisdom and strength.',
    reference: 'Chanakya Niti - Verse 3.7'
  },
  
  // Data Science Day 6 - Skewness & Kurtosis
  'skewness-kurtosis': {
    sanskrit: 'रूपं सर्वस्य स्वभावं दर्शयति।',
    transliteration: 'Rūpaṃ sarvasya svabhāvaṃ darśayati।',
    translation: 'Form reveals the nature of everything.',
    meaning: 'Understanding the shape of distributions through skewness and kurtosis reveals the true nature of data. Similarly, observing the form and structure of things helps us understand their essence.',
    reference: 'Arthashastra - Book 1, Chapter 9'
  },
  
  // Data Science Day 7 - Boxplots & IQR
  'boxplots-iqr': {
    sanskrit: 'सीमा सुरक्षायै आवश्यकी।',
    transliteration: 'Sīmā surakṣāyai āvaśyakī।',
    translation: 'Boundaries are necessary for protection.',
    meaning: 'Tukey fences create boundaries to identify outliers, protecting our analysis from extreme values. In life, setting healthy boundaries helps us maintain balance and protect what matters most.',
    reference: 'Arthashastra - Book 7, Chapter 13'
  },
  
  // Data Science Day 8 - Adjusted Boxplots
  'adjusted-boxplots': {
    sanskrit: 'समायोजनं परिस्थित्यनुसारं कर्तव्यम्।',
    transliteration: 'Samāyojanaṃ paristhityanusāraṃ kartavyam।',
    translation: 'Adjustment should be made according to circumstances.',
    meaning: 'Adjusted boxplots adapt to skewness, showing that one size does not fit all. Wisdom lies in adapting our methods and perspectives to the specific circumstances we face.',
    reference: 'Arthashastra - Book 6, Chapter 2'
  },
  
  // Data Science Day 9 - Z-Scores
  'z-scores': {
    sanskrit: 'मानकीकरणं तुलनायै आवश्यकम्।',
    transliteration: 'Mānakīkaraṇaṃ tulanāyai āvaśyakam।',
    translation: 'Standardization is necessary for comparison.',
    meaning: 'Z-scores standardize values to enable fair comparison across different scales. Similarly, establishing common standards and principles allows us to make fair and meaningful comparisons in life.',
    reference: 'Arthashastra - Book 2, Chapter 16'
  },
  
  // Data Science Day 10 - Isolation Forest
  'isolation-forest': {
    sanskrit: 'विलग्नता असामान्यतायै लक्षणम्।',
    transliteration: 'Vilagnatā asāmānyatāyai lakṣaṇam।',
    translation: 'Isolation is a sign of abnormality.',
    meaning: 'Isolation Forest identifies anomalies by finding what stands apart. Sometimes, being different or isolated can indicate something special or problematic that needs attention.',
    reference: 'Arthashastra - Book 4, Chapter 4'
  },
  
  // Data Science Day 11 - Kernel Density Estimation
  'kernel-density-estimation': {
    sanskrit: 'सुक्ष्मदृष्ट्या सत्यं दृश्यते।',
    transliteration: 'Sukṣmadṛṣṭyā satyaṃ dṛśyate।',
    translation: 'Truth is seen through subtle vision.',
    meaning: 'Kernel Density Estimation reveals hidden patterns by smoothing and connecting data points. Similarly, true understanding comes from looking beyond the surface and seeing the underlying connections.',
    reference: 'Chanakya Niti - Verse 5.14'
  },
  
  // Data Science Day 12 - Binning
  'binning-deciles': {
    sanskrit: 'वर्गीकरणं व्यवस्थायै आवश्यकम्।',
    transliteration: 'Vargīkaraṇaṃ vyavasthāyai āvaśyakam।',
    translation: 'Categorization is necessary for organization.',
    meaning: 'Binning organizes continuous data into meaningful categories, making it easier to understand and analyze. Similarly, organizing our thoughts and actions into clear categories helps us navigate complexity.',
    reference: 'Arthashastra - Book 2, Chapter 7'
  },
  
  // Data Science Day 13 - Stratified Sampling
  'sampling-stratified': {
    sanskrit: 'विवेकः सर्वकार्येषु श्रेष्ठः।',
    transliteration: 'Vivekaḥ sarvakāryeṣu śreṣṭhaḥ।',
    translation: 'Discrimination is best in all actions.',
    meaning: 'Stratified sampling teaches us to divide and analyze thoughtfully. Just as we categorize data into meaningful groups, wisdom comes from making careful distinctions in all our endeavors.',
    reference: 'Arthashastra - Book 1, Chapter 4'
  },
  
  // Blog Posts
  'gratitude-civilization': {
    sanskrit: 'कृतज्ञता सर्वेषु गुणेषु श्रेष्ठा।',
    transliteration: 'Kṛtajñatā sarveṣu guṇeṣu śreṣṭhā।',
    translation: 'Gratitude is the best of all virtues.',
    meaning: 'Being grateful for our heritage and civilization connects us to something greater than ourselves. Recognizing the wisdom of our ancestors and the richness of our culture brings humility and strength.',
    reference: 'Chanakya Niti - Verse 2.3'
  },
  
  'rss-centenary': {
    sanskrit: 'संघः शक्तिः कलौ युगे।',
    transliteration: 'Saṃghaḥ śaktiḥ kalau yuge।',
    translation: 'Organization is strength in this age.',
    meaning: 'Organizations that serve with dedication and unity create lasting impact. The strength of collective effort and shared purpose can transform society and preserve values across generations.',
    reference: 'Arthashastra - Book 9, Chapter 1'
  },
  
  'tribute-ajjju': {
    sanskrit: 'गुरुः पूज्यः सदा वन्द्यः, गुरोः सेवा परं तपः।',
    transliteration: 'Guruḥ pūjyaḥ sadā vandyaḥ, guroḥ sevā paraṃ tapaḥ।',
    translation: 'The teacher is always worthy of worship and respect. Serving the teacher is the highest penance.',
    meaning: 'Teachers and mentors hold a sacred place in our lives. Their guidance shapes us, and honoring them is honoring the divine wisdom they share. Gratitude to those who guide us is a mark of true character.',
    reference: 'Chanakya Niti - Verse 3.12'
  },
  
  'book-notes': {
    sanskrit: 'विद्यार्थी लभते विद्याम्, यदि श्रद्धावान् भवेत्।\nपुस्तकं सर्वश्रेष्ठं मित्रं, तस्मात् पठनं कर्तव्यम्॥',
    transliteration: 'Vidyārthī labhate vidyām, yadi śraddhāvān bhavet।\nPustakaṃ sarvaśreṣṭhaṃ mitraṃ, tasmāt paṭhanaṃ kartavyam॥',
    translation: 'A student gains knowledge if they are devoted. A book is the best friend, therefore reading should be done.',
    meaning: 'Books and continuous learning are essential for growth. Through reading and studying, we gain insights into complex topics like geopolitics, global order, and shifting dynamics. Knowledge from books helps us understand the world better and make informed decisions.',
    reference: 'Chanakya Niti - Verse 1.8 & 7.1'
  },
  
  'oracle-journey': {
    sanskrit: 'उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।\nन हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः॥\nपुरुषार्थेन सिद्धिः, न तु भाग्येन॥',
    transliteration: 'Udyamena hi sidhyanti kāryāṇi na manorathaiḥ।\nNa hi suptasya siṃhasya praviśanti mukhe mṛgāḥ॥\nPuruṣārthena siddhiḥ, na tu bhāgyena॥',
    translation: 'Work gets accomplished through effort, not through mere wishes. Deer do not enter the mouth of a sleeping lion. Success comes through human effort, not through fate alone.',
    meaning: 'Your journey from Cloud Analyst to Data Scientist at Oracle demonstrates the power of dedicated action. Focus on the work, the learning, and the growth—the transformation happens naturally when you commit to excellence without being attached to outcomes.',
    reference: 'Chanakya Niti - Verse 1.15 & Arthashastra - Book 1, Chapter 19'
  },
  
  'liverpool-football': {
    sanskrit: 'एकता सर्वशक्तिमान्।',
    transliteration: 'Ekatā sarvaśaktimān।',
    translation: 'Unity is all-powerful.',
    meaning: 'Liverpool embodies unity—the team, the fans, "You\'ll Never Walk Alone." Football is the beautiful game because it unites billions across the world. When players, fans, and communities come together with passion and dedication, that unity creates something powerful and transcendent.',
    reference: 'Arthashastra - Book 1, Chapter 2'
  }
};

function ChanakyaShubhashita({ topic, blogId, blogTitle }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this widget for this specific blog
    const dismissedKey = `chanakya-dismissed-${blogId}`;
    const wasDismissed = localStorage.getItem(dismissedKey);
    
    if (!wasDismissed) {
      // Show immediately when page loads, with a small delay for smooth appearance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500); // Small delay for better UX
      
      return () => clearTimeout(timer);
    }
  }, [blogId]);

  const handleClose = () => {
    setIsVisible(false);
    setHasDismissed(true);
    // Remember dismissal for this specific blog
    const dismissedKey = `chanakya-dismissed-${blogId}`;
    localStorage.setItem(dismissedKey, 'true');
  };

  // Get shubhashita - priority: blog-specific > topic-based > default
  let shubhashita = SHUBHASHITAS['default'];
  
  // First, check for blog-specific shubhashita by ID (exact match)
  if (blogId && BLOG_SPECIFIC_SHUBHASHITAS[blogId]) {
    shubhashita = BLOG_SPECIFIC_SHUBHASHITAS[blogId];
  }
  // Check for blog-specific by title keywords (for partial matching)
  else if (blogTitle) {
    const titleLower = blogTitle.toLowerCase();
    // Check if any blog-specific key matches the title
    for (const [key, value] of Object.entries(BLOG_SPECIFIC_SHUBHASHITAS)) {
      // Match if title contains the key or key is a significant part of the title
      if (titleLower.includes(key.toLowerCase()) || 
          (key.length > 5 && titleLower.includes(key.toLowerCase().substring(0, Math.min(key.length, 10))))) {
        shubhashita = value;
        break;
      }
    }
  }
  
  // If no blog-specific found, use topic-based selection
  if (shubhashita === SHUBHASHITAS['default'] && SHUBHASHITAS[topic]) {
    shubhashita = SHUBHASHITAS[topic];
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-auto sm:max-w-md animate-slide-up">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg shadow-xl p-4 sm:p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <span className="text-2xl">📜</span>
            </div>
            <div>
              <h3 className="font-bold text-amber-900 dark:text-amber-200 text-lg">Chanakya Niti</h3>
              <p className="text-xs text-amber-700 dark:text-amber-300">Ancient Wisdom</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sanskrit Text */}
        <div className="mb-4">
          <p className="text-amber-900 dark:text-amber-100 font-serif text-lg leading-relaxed whitespace-pre-line text-center">
            {shubhashita.sanskrit}
          </p>
        </div>

        {/* Transliteration */}
        <div className="mb-3">
          <p className="text-amber-800 dark:text-amber-200 text-sm italic text-center">
            {shubhashita.transliteration}
          </p>
        </div>

        {/* Translation */}
        <div className="mb-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-md border border-amber-200 dark:border-amber-800">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            <span className="font-semibold text-amber-900 dark:text-amber-200">Translation:</span> {shubhashita.translation}
          </p>
        </div>

        {/* Meaning */}
        <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-md border border-amber-200 dark:border-amber-800">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            <span className="font-semibold text-amber-900 dark:text-amber-200">Meaning:</span> {shubhashita.meaning}
          </p>
        </div>

        {/* Reference and Decorative element */}
        <div className="mt-4 space-y-2">
          {shubhashita.reference && (
            <div className="text-center">
              <p className="text-xs text-amber-600 dark:text-amber-400 italic font-medium">
                {shubhashita.reference}
              </p>
            </div>
          )}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
              <span>—</span>
              <span>Chanakya</span>
              <span>—</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChanakyaShubhashita;

