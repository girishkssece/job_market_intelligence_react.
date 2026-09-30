import React, { useState } from 'react';
import { PageWrapper, GlassCard, LoadingSpinner, Tabs, ErrorBanner } from '../components/common/UIComponents';
import { api } from '../services/api';
import { TARGET_ROLES, QUESTION_BANK } from '../data/constants';

export function InterviewPrep() {
  const [activeTab, setActiveTab] = useState('bank');
  const [role, setRole] = useState('Data Scientist');
  const [company, setCompany] = useState('');
  const [qType, setQType] = useState('All Types');
  const [expLevel, setExpLevel] = useState('Mid (3-6 yrs)');
  const [aiQuestions, setAiQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const [reviewQuestion, setReviewQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [reviewResult, setReviewResult] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiError(null);
    setAiQuestions(null);
    try {
      const res = await api.getInterviewQuestions({
        role, company, experience_level: expLevel, question_type: qType, count: 8,
      });
      if (res.error) setAiError(res.error);
      else setAiQuestions(res.result);
    } catch (err) {
      setAiError(err.message || 'Failed to generate questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAnswer = async (e) => {
    e.preventDefault();
    if (!reviewQuestion || !userAnswer) return;
    setReviewLoading(true);
    setReviewError(null);
    setReviewResult(null);
    try {
      const res = await api.reviewInterviewAnswer({
        role, question: reviewQuestion, answer: userAnswer,
      });
      if (res.error) setReviewError(res.error);
      else setReviewResult(res.result);
    } catch (err) {
      setReviewError(err.message || 'Failed to review answer.');
    } finally {
      setReviewLoading(false);
    }
  };

  const staticQuestions = QUESTION_BANK[role] || QUESTION_BANK['Data Scientist'];

  return (
    <PageWrapper
      title="🎯 Technical & Behavioral Interview Prep"
      subtitle="Master role-specific questions, generate tailored mock interviews, and evaluate your answers with AI."
    >
      <Tabs
        tabs={[
          { id: 'bank', label: '❓ Question Bank' },
          { id: 'ai', label: '🤖 AI Mock Interview' },
          { id: 'review', label: '📝 Answer Reviewer' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'bank' && (
        <div>
          <GlassCard className="no-hover mb-lg">
            <div className="form-group">
              <label className="form-label">Select Role for Question Bank</label>
              <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                {TARGET_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </GlassCard>

          <div className="flex flex-col gap-lg">
            {Object.entries(staticQuestions).map(([category, questions]) => (
              <GlassCard key={category} noHover>
                <h3 className="mb-md text-accent">{category} Questions</h3>
                <div className="flex flex-col gap-sm">
                  {questions.map((q, idx) => (
                    <div key={idx} className="accordion-item">
                      <div className="accordion-header">
                        <span>Q{idx + 1}: {q}</span>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setReviewQuestion(q);
                            setActiveTab('review');
                          }}
                        >
                          ✍️ Practice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="form-row">
          <GlassCard className="no-hover" style={{ flex: 1 }}>
            <h3 className="mb-md">⚙️ Generate Custom Mock Interview</h3>
            <form onSubmit={handleGenerateQuestions} className="flex flex-col gap-md">
              <div className="form-group">
                <label className="form-label">Target Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  {TARGET_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Company (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Amazon, TCS"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select className="form-select" value={expLevel} onChange={(e) => setExpLevel(e.target.value)}>
                  <option value="Fresher (0-1 yr)">Fresher (0-1 yr)</option>
                  <option value="Junior (1-3 yrs)">Junior (1-3 yrs)</option>
                  <option value="Mid (3-6 yrs)">Mid (3-6 yrs)</option>
                  <option value="Senior (6+ yrs)">Senior (6+ yrs)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Generating...' : '🤖 Generate Mock Interview'}
              </button>
            </form>
          </GlassCard>

          <GlassCard className="no-hover" style={{ flex: 1 }}>
            <h3 className="mb-md">📋 AI Mock Interview Set</h3>
            {loading ? (
              <LoadingSpinner text="Generating company-tailored interview questions..." />
            ) : aiError ? (
              <ErrorBanner error={aiError} />
            ) : aiQuestions ? (
              <div className="ai-result">{aiQuestions}</div>
            ) : (
              <div className="text-center text-muted" style={{ padding: '60px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤖</div>
                <p>Configure details on the left to generate customized interview questions.</p>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {activeTab === 'review' && (
        <div className="form-row">
          <GlassCard className="no-hover" style={{ flex: 1 }}>
            <h3 className="mb-md">✍️ Submit Answer for AI Evaluation</h3>
            <form onSubmit={handleReviewAnswer} className="flex flex-col gap-md">
              <div className="form-group">
                <label className="form-label">Role Context</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  {TARGET_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Interview Question</label>
                <input
                  type="text"
                  className="form-input"
                  value={reviewQuestion}
                  onChange={(e) => setReviewQuestion(e.target.value)}
                  placeholder="e.g. Explain the bias-variance tradeoff"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Response / Answer</label>
                <textarea
                  className="form-textarea"
                  style={{ height: 180 }}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={reviewLoading}>
                {reviewLoading ? 'Reviewing...' : '📊 Grade & Review My Answer'}
              </button>
            </form>
          </GlassCard>

          <GlassCard className="no-hover" style={{ flex: 1 }}>
            <h3 className="mb-md">📊 AI Score & Feedback</h3>
            {reviewLoading ? (
              <LoadingSpinner text="Evaluating answer depth and structure..." />
            ) : reviewError ? (
              <ErrorBanner error={reviewError} />
            ) : reviewResult ? (
              <div className="ai-result">{reviewResult}</div>
            ) : (
              <div className="text-center text-muted" style={{ padding: '60px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
                <p>Provide a question and your answer to receive a score out of 10 and improvements.</p>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </PageWrapper>
  );
}
