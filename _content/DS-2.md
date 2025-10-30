---
Id: 1002
Title: "Day 2 — Expressions as Algebra: Tokens, Precedence, and Infix → Postfix"
Author: Sughosh P Dixit
Tags: Data Science Mathematics Parsing Expressions Algorithms Rule Engines
Topic: Data Science
Abstract: "How to teach computers to read and evaluate expressions step by step — by tokenizing text, enforcing operator precedence, and converting rules to postfix (RPN) form for speed, clarity and consistency."
HeaderImage: /DS-2/expression_pipeline.png
isPublished: true
---

# Day 2 — Expressions as Algebra: Tokens, Precedence & Postfix (RPN) 🧮

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <div id="lottie-parsing" style={{width: '200px', height: '200px', margin: '0 auto'}}></div>
  <p style={{fontStyle: 'italic', color: '#666', marginTop: '1rem'}}>Teaching computers to understand expressions! 🚀</p>
</div>

## 🚀 The Big Idea

Humans read rules with ease. Computers need structure.

When we write something like 👇

```
score >= 0.85 and (stability > 0.9 or flag == 0)
```

…it looks natural to us but computers see a tangle of symbols. To evaluate this reliably, we teach machines three steps:

1️⃣ **Tokenize** – split text into meanings (words, numbers, operators).

2️⃣ **Respect precedence** – know which operators bind stronger.

3️⃣ **Translate to postfix (RPN)** – remove parentheses so evaluation is fast and unambiguous.

✨ This gives us rules that are consistent, explainable, and lightning-fast to evaluate.

## 💡 Where This Appears in Data Science

⚙️ **Rule-based labels & weak supervision** – define labels from heuristics in a clear, reproducible way.

👥 **Cohort & segment definitions** – select groups like "(active and high_quality) or (new_user and opted_in)".

🧪 **Data-quality & feature checks** – guard pipelines with rules like "not null" or value ranges.

📈 **Model monitoring & release criteria** – e.g. "(precision ≥ X and recall ≥ Y) or (lift ≥ Z)".

🧱 **Feature-engineering DSLs** – describe derived features safely and consistently.

🧾 **Governance & auditability** – align rule text with its computation for traceable results.

⚡ **Performance & scalability** – postfix evaluation runs in O(n) with a tiny stack.

## 🪄 Step 1 — Tokenize the Rule

Let's start with:

```
(score >= 0.85 and stability > 0.9) or (flag == 0)
```

Break it into typed pieces:

🆔 **IDs:** score, stability, flag

🔢 **Numbers:** 0.85, 0.9, 0

⚙️ **Operators:** >=, >, ==, and, or

🧩 **Parentheses:** (, )

**Token stream:**

```
( score >= 0.85 and stability > 0.9 ) or ( flag == 0 )
```

![Tokenization Example](/DS-2/tokenization_example.png)

## 📊 Step 2 — Operator Precedence 🎚️

A consistent order keeps rules predictable (high → low):

1️⃣ `* /`
2️⃣ `+ -`
3️⃣ Comparisons: `>= <= > < == !=`
4️⃣ `not` (unary)
5️⃣ `and`
6️⃣ `or`

🪶 **Parentheses always override everything.** Among equals, evaluate left to right.

![Precedence Ladder](/DS-2/precedence_ladder.png)

## 🔁 Step 3 — Infix → Postfix (RPN) 🚦

Using the shunting-yard algorithm:

- Send values straight to output 🟩
- Push operators on a stack 🗂️
- Pop higher/equal precedence ops before pushing a new one ↕️
- Handle parentheses to group logic `()` 🎯
- Pop everything left at the end 📤

✅ Our rule becomes:

```
score 0.85 >= stability 0.9 > and flag 0 == or
```

Same logic, zero ambiguity. Pure clarity.

![Infix to Postfix Conversion](/DS-2/infix_postfix.png)

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <div id="lottie-algorithm" style={{width: '180px', height: '180px', margin: '0 auto'}}></div>
  <p style={{fontStyle: 'italic', color: '#666', marginTop: '1rem'}}>Algorithms make it all work! 🧮</p>
</div>

## 🧰 How to Evaluate Postfix

Use a simple stack:

1️⃣ Read left → right.
2️⃣ Push values onto stack.
3️⃣ When you see an operator, pop the needed inputs, apply it, and push the result.
4️⃣ Return the final value (1 for True, 0 for False).

🧮 **AND/OR** use Boolean logic on those 1s and 0s.

## 🧩 Worked Example 1 — Full Evaluation

**Postfix:**

```
score 0.85 >= stability 0.9 > and flag 0 == or
```

| Row | score | stability | flag | Result | Explanation |
|-----|-------|-----------|------|--------|-------------|
| A | 0.86 | 0.91 | 1 | ✅ True | 1 ∧ 1 ∨ 0 = 1 |
| B | 0.86 | 0.70 | 0 | ✅ True | 1 ∧ 0 ∨ 1 = 1 |
| C | 0.70 | 0.70 | 1 | ❌ False | 0 ∧ 0 ∨ 0 = 0 |

## ⚖️ Worked Example 2 — Why Precedence Matters

Without parentheses:

```
score >= 0.85 and stability > 0.9 or flag == 0
```

Standard ladder → still evaluates as:

```
(score >= 0.85 and stability > 0.9) or (flag == 0)
```

💥 **Wrong precedence** (e.g., "or" before "and") flips results entirely!

🎯 **Always follow the ladder** —or use explicit brackets.

## 🧮 Worked Example 3 — With Arithmetic

**Infix:**

```
(feature_x / feature_y > 2) and (z_score + bonus >= 3)
```

**Postfix:**

```
feature_x feature_y / 2 > z_score bonus + 3 >= and
```

| Row | feature_x | feature_y | z_score | bonus | Result |
|-----|-----------|-----------|---------|-------|--------|
| 1 | 10 | 4 | 2.1 | 1.0 | ✅ True |
| 2 | 5 | 4 | 2.5 | 0.2 | ❌ False |

🧯 **Tip:** guard against division by zero in feature_y.

## 🚫 Worked Example 4 — Adding Unary not

**Infix:**

```
(not drift) and (quality >= 0.95 or coverage >= 0.98)
```

**Postfix:**

```
drift not quality 0.95 >= coverage 0.98 >= or and
```

| Row | drift | quality | coverage | Result |
|-----|-------|---------|----------|--------|
| 1 | 1 | 0.97 | 0.90 | ❌ False |
| 2 | 0 | 0.93 | 0.99 | ✅ True |

## 🏁 What You Gain

✅ **Consistency** – same rule = same result everywhere.

🧠 **Simplicity** – easy to evaluate and debug.

⚡ **Speed** – O(n) evaluation with tiny memory footprint.

🔍 **Clarity** – no hidden precedence surprises.

## 🧭 Takeaway

Turning rule strings into tokens, honoring a clear precedence order, and evaluating postfix makes your logic solid, predictable, and explainable.

A small engineering habit that scales beautifully from data validation to full-blown rule engines 💪

---

<div style={{textAlign: 'center', margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px', color: 'white'}}>
  <div id="lottie-celebration" style={{width: '200px', height: '200px', margin: '0 auto'}}></div>
  <h3 style={{margin: '1rem 0', color: 'white'}}>Day 2 Complete! 🎉</h3>
  <p style={{margin: 0, fontSize: '1.1rem', opacity: 0.9}}>*This is Day 2 of my 30-day challenge documenting my Data Science journey at Oracle! Stay tuned for more insights and mathematical foundations of data science. 🚀*</p>
  <div style={{marginTop: '1.5rem'}}>
    <span style={{background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '25px', fontSize: '0.9rem'}}>Next: Day 3 - Coming Tomorrow!</span>
  </div>
</div>

