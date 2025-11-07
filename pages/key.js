import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllTopics } from "../Lib/Data";

export const getStaticProps = () => {
  const allTopics = getAllTopics();
  return {
    props: {
      topics: allTopics,
    },
  };
};

export default function KeyPage({ topics }) {
  const glossary = {
    abbreviations: [
      {
        term: "IQR",
        definition: "Interquartile Range - the middle 50% of your data, calculated as Q₃ − Q₁. It's a robust measure of spread that resists outliers.",
        category: "Statistics"
      },
      {
        term: "ECDF",
        definition: "Empirical Cumulative Distribution Function - a step function that shows the proportion of data points at or below each value. It's the foundation for computing percentiles and quantiles.",
        category: "Statistics"
      },
      {
        term: "MAD",
        definition: "Median Absolute Deviation - a robust measure of spread that uses the median of absolute deviations from the median. It's resistant to outliers unlike standard deviation.",
        category: "Statistics"
      },
      {
        term: "SD",
        definition: "Standard Deviation - a measure of spread that squares deviations from the mean. It's sensitive to outliers and assumes normality.",
        category: "Statistics"
      },
      {
        term: "RPN",
        definition: "Reverse Polish Notation (also called Postfix notation) - a mathematical notation where operators follow their operands. It eliminates the need for parentheses and makes evaluation unambiguous.",
        category: "Algorithms"
      },
      {
        term: "DSL",
        definition: "Domain-Specific Language - a programming language specialized for a particular application domain, such as feature engineering or rule definition.",
        category: "Programming"
      },
      {
        term: "TL;DR",
        definition: "Too Long; Didn't Read - a brief summary of the main points.",
        category: "General"
      },
      {
        term: "Q₁",
        definition: "First Quartile (25th percentile) - the value below which 25% of the data falls.",
        category: "Statistics"
      },
      {
        term: "Q₂",
        definition: "Second Quartile (50th percentile or Median) - the middle value of the dataset.",
        category: "Statistics"
      },
      {
        term: "Q₃",
        definition: "Third Quartile (75th percentile) - the value below which 75% of the data falls.",
        category: "Statistics"
      },
    ],
    technicalTerms: [
      {
        term: "T-norm",
        definition: "Triangular norm - a generalization of logical AND to real-valued [0,1] degrees of truth. The Gödel t-norm uses the minimum operator: T(x,y) = min(x,y).",
        category: "Mathematics"
      },
      {
        term: "T-conorm",
        definition: "Triangular conorm (or s-norm) - a generalization of logical OR to real-valued [0,1] degrees of truth. The Gödel t-conorm uses the maximum operator: S(x,y) = max(x,y).",
        category: "Mathematics"
      },
      {
        term: "Gödel t-norm",
        definition: "A specific t-norm that uses the minimum operator to generalize AND. It preserves algebraic properties like commutativity, associativity, and monotonicity.",
        category: "Mathematics"
      },
      {
        term: "Boolean Logic",
        definition: "A branch of algebra that deals with binary values (true/false, 1/0) and logical operations like AND, OR, and NOT.",
        category: "Mathematics"
      },
      {
        term: "Fuzzy Logic",
        definition: "An extension of Boolean logic that allows degrees of truth between 0 and 1, enabling reasoning with uncertainty and partial truth.",
        category: "Mathematics"
      },
      {
        term: "Percentile",
        definition: "A value below which a given percentage of observations fall. For example, the 80th percentile is the value below which 80% of the data lies.",
        category: "Statistics"
      },
      {
        term: "Quantile",
        definition: "A generalization of percentiles. The p-th quantile is the value below which p proportion of the data falls. Percentiles are quantiles expressed as percentages.",
        category: "Statistics"
      },
      {
        term: "Order Statistics",
        definition: "The sorted values of a dataset. If you sort n values as x(1) ≤ x(2) ≤ ... ≤ x(n), these are the order statistics.",
        category: "Statistics"
      },
      {
        term: "Percentile Rank",
        definition: "The percentage of values in a dataset that are at or below a given value. It maps each observation to a number between 0 and 1.",
        category: "Statistics"
      },
      {
        term: "Stratification",
        definition: "Dividing a population into subgroups (strata) based on some criteria, such as percentile ranks or quantiles, for sampling or analysis purposes.",
        category: "Statistics"
      },
      {
        term: "Median",
        definition: "The middle value of a sorted dataset. It's a robust measure of central tendency that resists outliers, unlike the mean.",
        category: "Statistics"
      },
      {
        term: "Robust Statistics",
        definition: "Statistical methods that are resistant to outliers and violations of assumptions. Examples include median (instead of mean) and MAD (instead of SD).",
        category: "Statistics"
      },
      {
        term: "Z-score",
        definition: "A standardized score that measures how many standard deviations a value is from the mean. Robust z-scores use median and MAD instead of mean and SD.",
        category: "Statistics"
      },
      {
        term: "Skewness",
        definition: "A measure of the asymmetry of a distribution. Positive skew means a long tail to the right; negative skew means a long tail to the left.",
        category: "Statistics"
      },
      {
        term: "Kurtosis",
        definition: "A measure of the tail heaviness of a distribution. High kurtosis means heavy tails with many extremes; low kurtosis means light tails.",
        category: "Statistics"
      },
      {
        term: "Boxplot",
        definition: "A visual representation of data distribution showing quartiles, median, and outliers. It uses IQR and Tukey fences to identify outliers.",
        category: "Statistics"
      },
      {
        term: "Tukey Fences",
        definition: "Boundaries used to identify outliers in boxplots. Inner fence = Q₁ − 1.5×IQR and Q₃ + 1.5×IQR; outer fence = Q₁ − 3×IQR and Q₃ + 3×IQR.",
        category: "Statistics"
      },
      {
        term: "Outlier",
        definition: "A data point that is significantly different from other observations. Can be detected using z-scores, IQR methods, or Tukey fences.",
        category: "Statistics"
      },
      {
        term: "Nonparametric",
        definition: "Statistical methods that don't assume a specific distribution (like Normal). Examples include median, percentiles, and IQR-based methods.",
        category: "Statistics"
      },
      {
        term: "Tokenization",
        definition: "The process of breaking text into meaningful units (tokens) such as words, numbers, and operators for parsing and evaluation.",
        category: "Algorithms"
      },
      {
        term: "Operator Precedence",
        definition: "The order in which operators are evaluated in an expression. For example, multiplication is evaluated before addition.",
        category: "Algorithms"
      },
      {
        term: "Infix Notation",
        definition: "The standard mathematical notation where operators are placed between operands, e.g., 'a + b'. Requires parentheses for complex expressions.",
        category: "Algorithms"
      },
      {
        term: "Postfix Notation",
        definition: "A notation where operators follow their operands, e.g., 'a b +'. Also called Reverse Polish Notation (RPN). Eliminates need for parentheses.",
        category: "Algorithms"
      },
      {
        term: "Shunting Yard Algorithm",
        definition: "An algorithm for converting infix notation to postfix notation, using a stack to manage operators and precedence.",
        category: "Algorithms"
      },
      {
        term: "Monotone Transform",
        definition: "A function that preserves order - if x < y, then f(x) < f(y). Percentiles and ranks are invariant under monotone transforms.",
        category: "Mathematics"
      },
      {
        term: "Winsorizing",
        definition: "A method of handling outliers by capping extreme values at a certain percentile (e.g., replacing values above the 95th percentile with the 95th percentile value).",
        category: "Statistics"
      },
      {
        term: "Leptokurtic",
        definition: "A distribution with high kurtosis (kurtosis > 3), meaning it has heavy tails and many extreme values.",
        category: "Statistics"
      },
      {
        term: "Platykurtic",
        definition: "A distribution with low kurtosis (kurtosis < 3), meaning it has light tails and few extreme values.",
        category: "Statistics"
      },
    ]
  };

  // Combine and sort all terms
  const allTerms = [...glossary.abbreviations, ...glossary.technicalTerms].sort((a, b) => 
    a.term.localeCompare(b.term)
  );

  // Group by category
  const termsByCategory = {};
  allTerms.forEach(term => {
    if (!termsByCategory[term.category]) {
      termsByCategory[term.category] = [];
    }
    termsByCategory[term.category].push(term);
  });

  return (
    <>
      <Head>
        <title>Key Terms & Glossary | Sughosh's Chronicles</title>
        <meta name="description" content="Comprehensive glossary of abbreviations and technical terms used in data science and statistics articles." />
      </Head>

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar topics={topics} />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" style={{fontFamily: 'Charter, Georgia, serif'}}>
                Key Terms & Glossary
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                A comprehensive reference for abbreviations and technical terms used throughout the blog posts.
              </p>
            </div>

            {/* Quick Navigation */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Jump to Category:</h2>
              <div className="flex flex-wrap gap-2">
                {Object.keys(termsByCategory).sort().map(category => (
                  <a
                    key={category}
                    href={`#category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                    className="px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {category}
                  </a>
                ))}
              </div>
            </div>

            {/* Terms by Category */}
            {Object.keys(termsByCategory).sort().map(category => (
              <div key={category} id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`} className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700" style={{fontFamily: 'Charter, Georgia, serif'}}>
                  {category}
                </h2>
                <div className="space-y-6">
                  {termsByCategory[category].map((item, index) => (
                    <div key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {item.term}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Back to Top */}
            <div className="mt-12 text-center">
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                ↑ Back to Top
              </a>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}

