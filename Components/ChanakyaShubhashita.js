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
  
  // Data Science Day 14 - Hypergeometric Distribution & Sample Size
  'hypergeometric-sample-size': {
    sanskrit: 'सूक्ष्मदृष्ट्या सत्यं दृश्यते, युक्त्या च निश्चितम्।',
    transliteration: 'Sūkṣmadṛṣṭyā satyaṃ dṛśyate, yuktyā ca niścitam।',
    translation: 'Truth is seen through subtle vision, and certainty comes through logic.',
    meaning: 'Hypergeometric distribution teaches us to find rare events through exact mathematical reasoning. Just as we carefully sample to detect defects, wisdom comes from using precise methods and logic to uncover hidden truths that approximations might miss.',
    reference: 'Arthashastra - Book 2, Chapter 11'
  },
  'hypergeometric': {
    sanskrit: 'सूक्ष्मदृष्ट्या सत्यं दृश्यते, युक्त्या च निश्चितम्।',
    transliteration: 'Sūkṣmadṛṣṭyā satyaṃ dṛśyate, yuktyā ca niścitam।',
    translation: 'Truth is seen through subtle vision, and certainty comes through logic.',
    meaning: 'Hypergeometric distribution teaches us to find rare events through exact mathematical reasoning. Just as we carefully sample to detect defects, wisdom comes from using precise methods and logic to uncover hidden truths that approximations might miss.',
    reference: 'Arthashastra - Book 2, Chapter 11'
  },
  
  // Data Science Day 15 - Percentiles as Thresholds
  'percentiles-thresholds': {
    sanskrit: 'सीमा सर्वकार्येषु आवश्यकी, विवेकेन च निश्चिता।',
    transliteration: 'Sīmā sarvakāryeṣu āvaśyakī, vivekena ca niścitā।',
    translation: 'Boundaries are necessary in all actions, and are determined through discrimination.',
    meaning: 'Percentiles as thresholds teach us to draw clear boundaries based on data distribution. Just as we set decision thresholds at specific percentiles, wisdom comes from establishing clear boundaries and making decisions through careful discrimination and understanding of relative positions.',
    reference: 'Arthashastra - Book 7, Chapter 13'
  },
  'percentiles': {
    sanskrit: 'सीमा सर्वकार्येषु आवश्यकी, विवेकेन च निश्चिता।',
    transliteration: 'Sīmā sarvakāryeṣu āvaśyakī, vivekena ca niścitā।',
    translation: 'Boundaries are necessary in all actions, and are determined through discrimination.',
    meaning: 'Percentiles as thresholds teach us to draw clear boundaries based on data distribution. Just as we set decision thresholds at specific percentiles, wisdom comes from establishing clear boundaries and making decisions through careful discrimination and understanding of relative positions.',
    reference: 'Arthashastra - Book 7, Chapter 13'
  },
  
  // Data Science Day 16 - Elbow Detection
  'day-16-knee-elbow-detection-finding-the-sweet-spot': {
    sanskrit: 'अतिरिक्तं न कर्तव्यं, अल्पं च न पर्याप्तम्।\nमध्यमः पन्था श्रेष्ठः, सुखदः च सर्वदा॥',
    transliteration: 'Atiriktaṃ na kartavyaṃ, alpaṃ ca na paryāptam।\nMadhyamaḥ panthā śreṣṭhaḥ, sukhadḥ ca sarvadā॥',
    translation: 'Neither excess nor deficiency should be done. The middle path is best and always pleasant.',
    meaning: 'Elbow detection teaches us to find the optimal stopping point—not too aggressive, not too conservative, but just right. Just as we identify where diminishing returns accelerate, wisdom comes from recognizing when "more" becomes "enough" and stopping at the sweet spot that balances effort with returns.',
    reference: 'Arthashastra - Book 8, Chapter 5'
  },
  'elbow-detection': {
    sanskrit: 'अतिरिक्तं न कर्तव्यं, अल्पं च न पर्याप्तम्।\nमध्यमः पन्था श्रेष्ठः, सुखदः च सर्वदा॥',
    transliteration: 'Atiriktaṃ na kartavyaṃ, alpaṃ ca na paryāptam।\nMadhyamaḥ panthā śreṣṭhaḥ, sukhadḥ ca sarvadā॥',
    translation: 'Neither excess nor deficiency should be done. The middle path is best and always pleasant.',
    meaning: 'Elbow detection teaches us to find the optimal stopping point—not too aggressive, not too conservative, but just right. Just as we identify where diminishing returns accelerate, wisdom comes from recognizing when "more" becomes "enough" and stopping at the sweet spot that balances effort with returns.',
    reference: 'Arthashastra - Book 8, Chapter 5'
  },
  'knee-elbow': {
    sanskrit: 'अतिरिक्तं न कर्तव्यं, अल्पं च न पर्याप्तम्।\nमध्यमः पन्था श्रेष्ठः, सुखदः च सर्वदा॥',
    transliteration: 'Atiriktaṃ na kartavyaṃ, alpaṃ ca na paryāptam।\nMadhyamaḥ panthā śreṣṭhaḥ, sukhadḥ ca sarvadā॥',
    translation: 'Neither excess nor deficiency should be done. The middle path is best and always pleasant.',
    meaning: 'Elbow detection teaches us to find the optimal stopping point—not too aggressive, not too conservative, but just right. Just as we identify where diminishing returns accelerate, wisdom comes from recognizing when "more" becomes "enough" and stopping at the sweet spot that balances effort with returns.',
    reference: 'Arthashastra - Book 8, Chapter 5'
  },
  
  // Data Science Day 17 - Robust Ratios
  'day-17-robust-ratios-and-division-by-zero': {
    sanskrit: 'अति सर्वत्र वर्जयेत्।',
    transliteration: 'Ati sarvatra varjayet।',
    translation: 'Excess should be avoided everywhere.',
    meaning: 'This principle teaches the importance of balance and moderation. Just as robust ratios prevent computations from exploding to infinity by avoiding the extreme of division by zero, wisdom lies in avoiding extremes in all aspects of life to maintain stability and harmony.',
    reference: 'Subhashita Manjari'
  },
  'robust-ratios': {
    sanskrit: 'अति सर्वत्र वर्जयेत्।',
    transliteration: 'Ati sarvatra varjayet।',
    translation: 'Excess should be avoided everywhere.',
    meaning: 'This principle teaches the importance of balance and moderation. Just as robust ratios prevent computations from exploding to infinity by avoiding the extreme of division by zero, wisdom lies in avoiding extremes in all aspects of life to maintain stability and harmony.',
    reference: 'Subhashita Manjari'
  },

  // Data Science Day 18 - Time and Recurrence Math
  'day-18-time-and-recurrence-math-when-calendars-attack-your-data': {
    sanskrit: 'कालः करोति कार्याणि, कालः हरति जीवितम्।\nकालः सुप्तेषु जागर्ति, कालो हि दुरतिक्रमः॥',
    transliteration: 'Kālaḥ karoti kāryāṇi, kālaḥ harati jīvitam।\nKālaḥ supteṣu jāgarti, kālo hi duratikramaḥ॥',
    translation: 'Time accomplishes all tasks, time takes away life. Time is awake even when we sleep; time is indeed insurmountable.',
    meaning: 'This verse teaches that time is an all-powerful, relentless force that governs everything. Just as we must account for the irregularities of calendars and recurrence patterns in data, we must respect the immutable nature of time in life, for it is the ultimate controller of all outcomes.',
    reference: 'Mahabharata, Stri Parva 2.25'
  },
  'time-recurrence': {
    sanskrit: 'कालः करोति कार्याणि, कालः हरति जीवितम्।\nकालः सुप्तेषु जागर्ति, कालो हि दुरतिक्रमः॥',
    transliteration: 'Kālaḥ karoti kāryāṇi, kālaḥ harati jīvitam।\nKālaḥ supteṣu jāgarti, kālo hi duratikramaḥ॥',
    translation: 'Time accomplishes all tasks, time takes away life. Time is awake even when we sleep; time is indeed insurmountable.',
    meaning: 'This principle teaches that time is an all-powerful, relentless force. Just as we must account for the irregularities of calendars and recurrence in data, we must respect the immutable nature of time, for it is the ultimate controller of all outcomes.',
    reference: 'Mahabharata, Stri Parva 2.25'
  },
  
  // Data Science Day 19 - Precision, Recall, and F1
  'day-19-precision-recall-and-f1-as-objectives': {
    sanskrit: 'मापनं सर्वकार्येषु आवश्यकम्, विवेकेन च निश्चितम्।\nसत्यं मापनं सफलतायै मूलम्॥',
    transliteration: 'Māpanaṃ sarvakāryeṣu āvaśyakam, vivekena ca niścitam।\nSatyaṃ māpanaṃ saphalatāyai mūlam॥',
    translation: 'Measurement is necessary in all actions, and is determined through discrimination. True measurement is the root of success.',
    meaning: 'Just as Precision, Recall, and F1 provide true measurement of model performance beyond misleading accuracy, wisdom comes from measuring and evaluating with discrimination. Understanding what to measure and how to measure it correctly is the foundation of success in any endeavor.',
    reference: 'Arthashastra - Book 2, Chapter 16'
  },
  'precision-recall-f1': {
    sanskrit: 'मापनं सर्वकार्येषु आवश्यकम्, विवेकेन च निश्चितम्।\nसत्यं मापनं सफलतायै मूलम्॥',
    transliteration: 'Māpanaṃ sarvakāryeṣu āvaśyakam, vivekena ca niścitam।\nSatyaṃ māpanaṃ saphalatāyai mūlam॥',
    translation: 'Measurement is necessary in all actions, and is determined through discrimination. True measurement is the root of success.',
    meaning: 'Precision, Recall, and F1 provide true measurement of model performance. Wisdom comes from measuring with discrimination and understanding what metrics truly matter for success.',
    reference: 'Arthashastra - Book 2, Chapter 16'
  },
  
  // Data Science Day 20 - Two-Feature Decision Surfaces
  'day-20-two-feature-decision-surfaces-from-rule-expressions': {
    sanskrit: 'विभागः सर्वकार्येषु आवश्यकः, सीमा च निश्चिता।\nस्पष्टः विभागः सफलतायै मूलम्॥',
    transliteration: 'Vibhāgaḥ sarvakāryeṣu āvaśyakaḥ, sīmā ca niścitā।\nSpaṣṭaḥ vibhāgaḥ saphalatāyai mūlam॥',
    translation: 'Division is necessary in all actions, and boundaries are determined. Clear division is the root of success.',
    meaning: 'Just as decision surfaces create clear boundaries and divisions in feature space, wisdom comes from making clear distinctions and establishing well-defined boundaries. Understanding how to partition and organize complex spaces leads to successful outcomes.',
    reference: 'Arthashastra - Book 7, Chapter 13'
  },
  'decision-surfaces': {
    sanskrit: 'विभागः सर्वकार्येषु आवश्यकः, सीमा च निश्चिता।\nस्पष्टः विभागः सफलतायै मूलम्॥',
    transliteration: 'Vibhāgaḥ sarvakāryeṣu āvaśyakaḥ, sīmā ca niścitā।\nSpaṣṭaḥ vibhāgaḥ saphalatāyai mūlam॥',
    translation: 'Division is necessary in all actions, and boundaries are determined. Clear division is the root of success.',
    meaning: 'Decision surfaces create clear boundaries in feature space. Wisdom comes from making clear distinctions and establishing well-defined partitions that organize complex spaces effectively.',
    reference: 'Arthashastra - Book 7, Chapter 13'
  },
  
  // Data Science Day 21 - Contingency Tables and Bin-Wise Uplift
  'day-21-contingency-tables-and-bin-wise-uplift': {
    sanskrit: 'विभागेन सत्यं दृश्यते, समग्रता च भ्रमाय।\nसूक्ष्मदृष्ट्या सत्यं ज्ञायते॥',
    transliteration: 'Vibhāgena satyaṃ dṛśyate, samagratā ca bhramāya।\nSūkṣmadṛṣṭyā satyaṃ jñāyate॥',
    translation: 'Truth is seen through division, and aggregation leads to confusion. Truth is known through subtle vision.',
    meaning: 'Just as bin-wise analysis reveals true patterns that aggregated metrics hide, wisdom comes from examining details rather than relying solely on high-level summaries. Contingency tables and segmented analysis help us see the truth that Simpson\'s paradox would otherwise obscure.',
    reference: 'Arthashastra - Book 2, Chapter 11'
  },
  'day-22-set-theory-and-venn-diagrams-for-comparisons': {
    sanskrit: 'समानता दृश्यते तुलनेन, विभिन्नता च ज्ञायते।\nसर्वं सम्बन्धेन निर्णीतं भवति॥',
    transliteration: 'Samānatā dṛśyate tulanena, vibhinnatā ca jñāyate।\nSarvaṃ sambandhena nirṇītaṃ bhavati॥',
    translation: 'Similarity is seen through comparison, and difference is known. Everything is determined by relationships.',
    meaning: 'Set theory and Venn diagrams teach us that understanding comes from comparing and contrasting. Just as we measure overlap and relationships between sets, wisdom comes from recognizing both similarities and differences. True insight emerges when we understand how elements relate to each other, whether they intersect, overlap, or remain distinct.',
    reference: 'Arthashastra - Book 1, Chapter 8'
  },
  'contingency-uplift': {
    sanskrit: 'विभागेन सत्यं दृश्यते, समग्रता च भ्रमाय।\nसूक्ष्मदृष्ट्या सत्यं ज्ञायते॥',
    transliteration: 'Vibhāgena satyaṃ dṛśyate, samagratā ca bhramāya।\nSūkṣmadṛṣṭyā satyaṃ jñāyate॥',
    translation: 'Truth is seen through division, and aggregation leads to confusion. Truth is known through subtle vision.',
    meaning: 'Bin-wise analysis reveals patterns that aggregated metrics hide. Wisdom comes from examining details and avoiding the confusion that aggregation can create.',
    reference: 'Arthashastra - Book 2, Chapter 11'
  },

  // Data Science Day 23 - Label Post-Processing
  'day-23-label-post-processing-partitioning-flagged-vs-passed-mathematically': {
    sanskrit: 'सत्यं ब्रूयात् प्रियं ब्रूयात् न ब्रूयात् सत्यमप्रियम्।\nविभागः सत्यस्य मूलम्॥',
    transliteration: 'Satyaṃ brūyāt priyaṃ brūyāt na brūyāt satyamapriyam।\nVibhāgaḥ satyasya mūlam॥',
    translation: 'Speak the truth clearly. Division is the root of truth.',
    meaning: 'Just as indicator functions create clear binary distinctions (1 or 0, Flagged or Passed), wisdom comes from making precise classifications. Piecewise partitions ensure every entity belongs to exactly one category—no ambiguity, no overlap.',
    reference: 'Chanakya Niti - Verse 4.13'
  },
  'label-post-processing': {
    sanskrit: 'सत्यं ब्रूयात् प्रियं ब्रूयात् न ब्रूयात् सत्यमप्रियम्।\nविभागः सत्यस्य मूलम्॥',
    transliteration: 'Satyaṃ brūyāt priyaṃ brūyāt na brūyāt satyamapriyam।\nVibhāgaḥ satyasya mūlam॥',
    translation: 'Speak the truth clearly. Division is the root of truth.',
    meaning: 'Just as indicator functions create clear binary distinctions (1 or 0, Flagged or Passed), wisdom comes from making precise classifications. Piecewise partitions ensure every entity belongs to exactly one category—no ambiguity, no overlap.',
    reference: 'Chanakya Niti - Verse 4.13'
  },
  'flagged-passed': {
    sanskrit: 'सत्यं ब्रूयात् प्रियं ब्रूयात् न ब्रूयात् सत्यमप्रियम्।\nविभागः सत्यस्य मूलम्॥',
    transliteration: 'Satyaṃ brūyāt priyaṃ brūyāt na brūyāt satyamapriyam।\nVibhāgaḥ satyasya mūlam॥',
    translation: 'Speak the truth clearly. Division is the root of truth.',
    meaning: 'Indicator functions and piecewise partitions provide mathematical precision in event classification. Clear distinctions eliminate ambiguity.',
    reference: 'Chanakya Niti - Verse 4.13'
  },

  // Data Science Day 24 - Risk Segmentation (Priority Tiers)
  'day-24-risk-segmentation-priority-tiers-as-priors-and-costs': {
    sanskrit: 'विवेकः सर्वकार्येषु श्रेष्ठः।\nमूल्यं च कार्यस्य निर्णायकम्॥',
    transliteration: 'Vivekaḥ sarvakāryeṣu śreṣṭhaḥ।\nMūlyaṃ ca kāryasya nirṇāyakam॥',
    translation: 'Discrimination is best in all actions. Cost determines the outcome of action.',
    meaning: 'Not all errors are equal—cost-sensitive thresholding teaches us to weigh decisions by their consequences. Just as the Bayes optimal threshold adapts to costs and priors, wisdom lies in making decisions that account for the true stakes involved.',
    reference: 'Arthashastra - Book 7, Chapter 1'
  },
  'risk-segmentation': {
    sanskrit: 'विवेकः सर्वकार्येषु श्रेष्ठः।\nमूल्यं च कार्यस्य निर्णायकम्॥',
    transliteration: 'Vivekaḥ sarvakāryeṣu śreṣṭhaḥ।\nMūlyaṃ ca kāryasya nirṇāyakam॥',
    translation: 'Discrimination is best in all actions. Cost determines the outcome of action.',
    meaning: 'Cost-sensitive decisions account for the true stakes involved. Different priority tiers deserve different thresholds based on their costs and priors.',
    reference: 'Arthashastra - Book 7, Chapter 1'
  },
  'priority-tiers': {
    sanskrit: 'विवेकः सर्वकार्येषु श्रेष्ठः।\nमूल्यं च कार्यस्य निर्णायकम्॥',
    transliteration: 'Vivekaḥ sarvakāryeṣu śreṣṭhaḥ।\nMūlyaṃ ca kāryasya nirṇāyakam॥',
    translation: 'Discrimination is best in all actions. Cost determines the outcome of action.',
    meaning: 'Different priority tiers require different decision thresholds. Cost-sensitive approaches ensure we make optimal choices based on the true consequences of each tier.',
    reference: 'Arthashastra - Book 7, Chapter 1'
  },

  // Data Science Day 25 - Configuration Pairing Logic
  'day-25-configuration-pairing-logic-and-equivalence-classes': {
    sanskrit: 'समानता दृश्यते तुलनेन, विभिन्नता च ज्ञायते।\nयुग्मं सामञ्जस्यस्य मूलम्॥',
    transliteration: 'Samānatā dṛśyate tulanena, vibhinnatā ca jñāyate।\nYugmaṃ sāmañjasyasya mūlam॥',
    translation: 'Similarity is seen through comparison, difference is known. Pairing is the root of harmony.',
    meaning: 'Equivalence relations group complementary segments together, ensuring consistency across paired configurations. Just as bipartite matching creates perfect pairings, wisdom comes from recognizing natural complementary relationships and maintaining alignment between them.',
    reference: 'Arthashastra - Book 1, Chapter 8'
  },
  'configuration-pairing': {
    sanskrit: 'समानता दृश्यते तुलनेन, विभिन्नता च ज्ञायते।\nयुग्मं सामञ्जस्यस्य मूलम्॥',
    transliteration: 'Samānatā dṛśyate tulanena, vibhinnatā ca jñāyate।\nYugmaṃ sāmañjasyasya mūlam॥',
    translation: 'Similarity is seen through comparison, difference is known. Pairing is the root of harmony.',
    meaning: 'Equivalence relations and bipartite matching ensure complementary segments work together harmoniously. Consistency across pairs is maintained through mapping functions.',
    reference: 'Arthashastra - Book 1, Chapter 8'
  },
  'equivalence-classes': {
    sanskrit: 'समानता दृश्यते तुलनेन, विभिन्नता च ज्ञायते।\nयुग्मं सामञ्जस्यस्य मूलम्॥',
    transliteration: 'Samānatā dṛśyate tulanena, vibhinnatā ca jñāyate।\nYugmaṃ sāmañjasyasya mūlam॥',
    translation: 'Similarity is seen through comparison, difference is known. Pairing is the root of harmony.',
    meaning: 'Equivalence classes partition sets into natural groupings. Understanding these relationships ensures consistent treatment of related entities.',
    reference: 'Arthashastra - Book 1, Chapter 8'
  },

  // Data Science Day 26 - Fuzzy Logic and T-Norms
  'day-26-from-rules-to-fuzzy-logic-why-min-max-matters': {
    sanskrit: 'अल्पानामपि वस्तूनां संहतिः कार्यसाधिका।\nतृणैर्गुणत्वमापन्नैर्बध्यन्ते मत्तदन्तिनः॥',
    transliteration: 'Alpānāmapi vastūnāṃ saṃhatiḥ kāryasādhikā।\nTṛṇairguṇatvamāpannairbaddhyante mattadantinaḥ॥',
    translation: 'Even small things, when combined, accomplish great tasks. With ropes made of grass, mighty elephants are bound.',
    meaning: 'Just as min/max operators aggregate multiple weak conditions into a strong decision, the power of combination exceeds the sum of parts. The weakest link (min) determines the chain\'s strength, while the strongest element (max) lifts the whole. Unity in aggregation creates power.',
    reference: 'Hitopadesha - Mitralābha, Verse 35'
  },
  'fuzzy-logic': {
    sanskrit: 'अल्पानामपि वस्तूनां संहतिः कार्यसाधिका।\nतृणैर्गुणत्वमापन्नैर्बध्यन्ते मत्तदन्तिनः॥',
    transliteration: 'Alpānāmapi vastūnāṃ saṃhatiḥ kāryasādhikā।\nTṛṇairguṇatvamāpannairbaddhyante mattadantinaḥ॥',
    translation: 'Even small things, when combined, accomplish great tasks. With ropes made of grass, mighty elephants are bound.',
    meaning: 'Fuzzy logic teaches us that partial truths, when properly aggregated using min/max or other t-norms, lead to robust decisions. The strength of combination lies in understanding how to merge conditions wisely.',
    reference: 'Hitopadesha - Mitralābha, Verse 35'
  },
  't-norms': {
    sanskrit: 'अल्पानामपि वस्तूनां संहतिः कार्यसाधिका।\nतृणैर्गुणत्वमापन्नैर्बध्यन्ते मत्तदन्तिनः॥',
    transliteration: 'Alpānāmapi vastūnāṃ saṃhatiḥ kāryasādhikā।\nTṛṇairguṇatvamāpannairbaddhyante mattadantinaḥ॥',
    translation: 'Even small things, when combined, accomplish great tasks. With ropes made of grass, mighty elephants are bound.',
    meaning: 'T-norms generalize AND operations—minimum takes the conservative path of the weakest link, product multiplies uncertainties, and Łukasiewicz demands both conditions be strong. Choose your aggregation wisely.',
    reference: 'Hitopadesha - Mitralābha, Verse 35'
  },
  'min-max': {
    sanskrit: 'अल्पानामपि वस्तूनां संहतिः कार्यसाधिका।\nतृणैर्गुणत्वमापन्नैर्बध्यन्ते मत्तदन्तिनः॥',
    transliteration: 'Alpānāmapi vastūnāṃ saṃhatiḥ kāryasādhikā।\nTṛṇairguṇatvamāpannairbaddhyante mattadantinaḥ॥',
    translation: 'Even small things, when combined, accomplish great tasks. With ropes made of grass, mighty elephants are bound.',
    meaning: 'Min/max operators provide idempotent, conservative aggregation. The minimum ensures the weakest condition bounds the result, while maximum ensures the strongest element prevails. Stability through simplicity.',
    reference: 'Hitopadesha - Mitralābha, Verse 35'
  },

  // Data Science Day 27 - Quantile Stability and Small Samples
  'day-27-quantile-stability-ties-and-small-samples': {
    sanskrit: 'अल्पेनापि प्रमादेन सागरोऽपि विशुष्यति।\nसूक्ष्मेषु विचारः कार्यः, स्थिरता तत्र लभ्यते॥',
    transliteration: 'Alpenāpi pramādena sāgaro\'pi viśuṣyati।\nSūkṣmeṣu vicāraḥ kāryaḥ, sthiratā tatra labhyate॥',
    translation: 'Even the ocean dries up through small negligence. Care must be taken in subtle matters; stability is found there.',
    meaning: 'Small samples and ties can destabilize quantile estimates just as small drops can drain an ocean. Careful handling of edge cases—interpolation methods, tie-breaking, sample size—ensures stable, repeatable thresholds.',
    reference: 'Chanakya Niti - Verse 8.14'
  },
  'quantile-stability': {
    sanskrit: 'अल्पेनापि प्रमादेन सागरोऽपि विशुष्यति।\nसूक्ष्मेषु विचारः कार्यः, स्थिरता तत्र लभ्यते॥',
    transliteration: 'Alpenāpi pramādena sāgaro\'pi viśuṣyati।\nSūkṣmeṣu vicāraḥ kāryaḥ, sthiratā tatra labhyate॥',
    translation: 'Even the ocean dries up through small negligence. Care must be taken in subtle matters; stability is found there.',
    meaning: 'Quantile estimation requires attention to detail. Ties and small samples introduce subtle instabilities that can affect threshold repeatability if not handled carefully.',
    reference: 'Chanakya Niti - Verse 8.14'
  },
  'small-samples': {
    sanskrit: 'अल्पेनापि प्रमादेन सागरोऽपि विशुष्यति।\nसूक्ष्मेषु विचारः कार्यः, स्थिरता तत्र लभ्यते॥',
    transliteration: 'Alpenāpi pramādena sāgaro\'pi viśuṣyati।\nSūkṣmeṣu vicāraḥ kāryaḥ, sthiratā tatra labhyate॥',
    translation: 'Even the ocean dries up through small negligence. Care must be taken in subtle matters; stability is found there.',
    meaning: 'Small samples require extra care in statistical estimation. What seems negligible at scale can cause significant variance in limited data.',
    reference: 'Chanakya Niti - Verse 8.14'
  },

  // Data Science Day 28 - Robust Imputation and Numeric Coercion
  'day-28-robust-imputation-and-numeric-coercion': {
    sanskrit: 'अद्भिर्गात्राणि शुध्यन्ति मनः सत्येन शुध्यति।\nविद्यातपोभ्यां भूतात्मा बुद्धिर्ज्ञानेन शुध्यति॥',
    transliteration: 'Adbhirgātrāṇi śudhyanti manaḥ satyena śudhyati।\nVidyātapobhyāṃ bhūtātmā buddhirjñānena śudhyati॥',
    translation: 'The body is cleansed by water, the mind is purified by truth, the soul by learning and penance, and the intellect by knowledge.',
    meaning: 'Just as purification is essential for the body and mind, robust imputation cleanses raw data. Replacing missing values and coercing types is the act of purifying data to reveal its true statistical nature before analysis begins.',
    reference: 'Manusmriti 5.109 & Chanakya Niti 3.1'
  },
  'imputation': {
    sanskrit: 'अद्भिर्गात्राणि शुध्यन्ति मनः सत्येन शुध्यति।',
    transliteration: 'Adbhirgātrāṇi śudhyanti manaḥ satyena śudhyati।',
    translation: 'The body is cleansed by water, the mind is purified by truth.',
    meaning: 'Data imputation is the purification process for datasets. Handling missing values correctly ensures the integrity (truth) of downstream analysis.',
    reference: 'Chanakya Niti 3.1'
  },

  // Data Science Day 29 - Stratified Audit Plan
  'day-29-putting-it-all-together-stratified-audit-plan': {
    sanskrit: 'मन्त्रमूलं हि राज्यम्।\nसुविचिन्त्य च यत्कृतं सुदीर्घकालेऽपि न नश्यति॥',
    transliteration: 'Mantramūlaṃ hi rājyam।\nSuvicintya ca yatkṛtaṃ sudīrghakāle\'pi na naśyati॥',
    translation: 'Strategy is the root of the kingdom. What is done after careful consideration does not perish even after a long time.',
    meaning: 'A successful audit plan is rooted in strategy (mantra). Stratification, sample sizing, and threshold setting require careful design. A well-planned audit structure endures and yields reliable insights, unlike hasty, unstructured checks.',
    reference: 'Arthashastra - Book 1, Chapter 15'
  },
  'audit-plan': {
    sanskrit: 'सुविचिन्त्य च यत्कृतं सुदीर्घकालेऽपि न नश्यति।',
    transliteration: 'Suvicintya ca yatkṛtaṃ sudīrghakāle\'pi na naśyati।',
    translation: 'What is done after careful consideration does not perish even after a long time.',
    meaning: 'Planning an audit requires foresight. Stratification and sampling design ensure that the results stand the test of scrutiny.',
    reference: 'Chanakya Niti'
  },

  // Data Science Day 30 - Mathematical Blueprint
  'day-30-mathematical-blueprint-scenario-calibration-summary': {
    sanskrit: 'सर्वस्य सारं गृह्णीयात् पुष्पेभ्यः इव षट्पदः।\nतस्मात् सर्वप्रयत्नेन सारं विद्यां समाचरेत्॥',
    transliteration: 'Sarvasya sāraṃ gṛhṇīyāt puṣpebhyaḥ iva ṣaṭpadaḥ।\nTasmāt sarvaprayatnena sāraṃ vidyāṃ samācaret॥',
    translation: 'One should extract the essence from everything, just as a bee takes nectar from flowers. Therefore, with all effort, one should practice essential knowledge.',
    meaning: 'Day 30 synthesizes the entire journey. Just as a bee collects the essence, this blueprint brings together nonparametrics, robust stats, sampling, and fuzzy logic into a cohesive whole. Grasping this essence is the ultimate goal of the challenge.',
    reference: 'Chanakya Niti - Verse 1.14'
  },
  'blueprint': {
    sanskrit: 'सर्वस्य सारं गृह्णीयात् पुष्पेभ्यः इव षट्पदः।',
    transliteration: 'Sarvasya sāraṃ gṛhṇīyāt puṣpebhyaḥ iva ṣaṭpadaḥ।',
    translation: 'One should extract the essence from everything, just as a bee takes nectar from flowers.',
    meaning: 'A blueprint represents the essence of the system. It distills complex components into a clear, actionable structure.',
    reference: 'Chanakya Niti - Verse 1.14'
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

  useEffect(() => {
    // Show immediately when page loads, with a small delay for smooth appearance
    // This will happen every time the blog is opened
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Small delay for better UX
    
    return () => clearTimeout(timer);
  }, [blogId]); // Re-run when blogId changes (different blog)

  const handleClose = () => {
    // Close the widget for the current session only
    // It will show again when the page is reloaded or revisited
    setIsVisible(false);
  };

  // Get shubhashita - priority: blog-specific > topic-based > default
  let shubhashita = BLOG_SPECIFIC_SHUBHASHITAS[blogId] || 
                    Object.values(BLOG_SPECIFIC_SHUBHASHITAS).find(shub => blogTitle.toLowerCase().includes(Object.keys(BLOG_SPECIFIC_SHUBHASHITAS).find(key => BLOG_SPECIFIC_SHUBHASHITAS[key] === shub).toLowerCase())) ||
                    SHUBHASHITAS[topic] || 
                    SHUBHASHITAS['default'];

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

