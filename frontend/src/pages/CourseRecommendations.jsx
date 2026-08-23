import React, { useState } from 'react';
import { PageWrapper, GlassCard, Tabs } from '../components/common/UIComponents';
import { COURSES, ROLE_COURSES, TARGET_ROLES } from '../data/constants';

export function CourseRecommendations() {
  const [activeTab, setActiveTab] = useState('role');
  const [selectedRole, setSelectedRole] = useState('Data Scientist');
  const [selectedSkill, setSelectedSkill] = useState('python');
  const [priceFilter, setPriceFilter] = useState('All');

  const roleSkills = ROLE_COURSES[selectedRole] || ['python', 'sql', 'machine learning'];

  const filterCourse = (c) => {
    if (priceFilter === 'Free Only') return c.price.toLowerCase().includes('free');
    if (priceFilter === 'Paid') return !c.price.toLowerCase().includes('free');
    return true;
  };

  return (
    <PageWrapper
      title="📚 Recommended Learning Paths & Courses"
      subtitle="Bridge your skill gaps with curated free and paid courses from top platforms."
    >
      <Tabs
        tabs={[
          { id: 'role', label: '🎯 Recommended by Role' },
          { id: 'skill', label: '🔍 Search by Specific Skill' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <GlassCard className="no-hover mb-lg">
        <div className="form-row">
          {activeTab === 'role' ? (
            <div className="form-group">
              <label className="form-label">Select Target Role</label>
              <select className="form-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                {TARGET_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Select Skill</label>
              <select className="form-select" value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
                {Object.keys(COURSES).map((s) => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Filter by Price</label>
            <select className="form-select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
              <option value="All">All Courses</option>
              <option value="Free Only">Free Only</option>
              <option value="Paid">Paid Only</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {activeTab === 'role' ? (
        <div className="flex flex-col gap-lg stagger-children">
          {roleSkills.map((sk) => {
            const list = (COURSES[sk] || []).filter(filterCourse);
            if (list.length === 0) return null;
            return (
              <GlassCard key={sk} noHover>
                <h3 className="mb-md text-accent">Skill Area: {sk.toUpperCase()}</h3>
                <div className="flex flex-col gap-sm">
                  {list.map((course, idx) => (
                    <div key={idx} className="course-card">
                      <div>
                        <strong>{course.name}</strong>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                          by {course.provider} • {course.platform} ({course.duration})
                        </p>
                      </div>
                      <div className="flex items-center gap-md">
                        <span className="badge badge-accent">{course.price}</span>
                        <span className="badge badge-neutral">{course.level}</span>
                        <a href={course.url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                          Start →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard noHover>
          <h3 className="mb-md text-accent">Courses for {selectedSkill.toUpperCase()}</h3>
          <div className="flex flex-col gap-sm">
            {(COURSES[selectedSkill] || []).filter(filterCourse).map((course, idx) => (
              <div key={idx} className="course-card">
                <div>
                  <strong>{course.name}</strong>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                    by {course.provider} • {course.platform} ({course.duration})
                  </p>
                </div>
                <div className="flex items-center gap-md">
                  <span className="badge badge-accent">{course.price}</span>
                  <span className="badge badge-neutral">{course.level}</span>
                  <a href={course.url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                    Start Course →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </PageWrapper>
  );
}
