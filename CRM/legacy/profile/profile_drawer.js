// ── PROFILE DRAWER ── inject into any page
(function () {
    const drawerHTML = `
    <div id="profile-overlay" onclick="closeProfileDrawer()" style="display:none;position:fixed;inset:0;background:rgba(15,23,42,0.4);z-index:998;backdrop-filter:blur(3px);transition:opacity .3s;"></div>
    <div id="profile-drawer" style="position:fixed;top:0;right:0;height:100vh;width:360px;background:#fff;z-index:999;box-shadow:-12px 0 48px rgba(0,0,0,0.14);transform:translateX(100%);transition:transform 0.3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;overflow:hidden;">

        <!-- Header -->
        <div style="padding:20px 20px 0;flex-shrink:0;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                <p style="font-size:9px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;">My Profile</p>
                <button onclick="closeProfileDrawer()" style="width:28px;height:28px;border-radius:8px;border:1px solid #e2e8f0;background:#f8fafc;display:flex;align-items:center;justify-content:center;cursor:pointer;">
                    <i class="fa-solid fa-xmark" style="font-size:10px;color:#64748b;"></i>
                </button>
            </div>

            <!-- Avatar + Name -->
            <div style="display:flex;align-items:center;gap:14px;padding:16px;background:#f8fafc;border-radius:14px;border:1px solid #f1f5f9;margin-bottom:6px;">
                <div id="pd-avatar" style="width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff;flex-shrink:0;"></div>
                <div style="flex:1;min-width:0;">
                    <p id="pd-name" style="font-size:15px;font-weight:800;color:#0f172a;line-height:1.2;"></p>
                    <p id="pd-email" style="font-size:10px;color:#64748b;margin-top:2px;font-weight:500;"></p>
                    <div id="pd-role-badge" style="display:inline-flex;align-items:center;margin-top:6px;padding:2px 9px;border-radius:99px;font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;"></div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div style="display:flex;border-bottom:1px solid #f1f5f9;padding:0 20px;flex-shrink:0;margin-top:4px;">
            <button id="ptab-details" onclick="switchProfileTab('details')" style="flex:1;padding:10px 4px;font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#0f172a;border:none;border-bottom:2px solid #0f172a;background:none;cursor:pointer;">
                <i class="fa-solid fa-user mr-1"></i>Details
            </button>
            <button id="ptab-password" onclick="switchProfileTab('password')" style="flex:1;padding:10px 4px;font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;border:none;border-bottom:2px solid transparent;background:none;cursor:pointer;">
                <i class="fa-solid fa-lock mr-1"></i>Password
            </button>
        </div>

        <!-- Scrollable Content -->
        <div style="flex:1;overflow-y:auto;padding:20px;">

            <!-- DETAILS TAB -->
            <div id="ppanel-details">
                <div style="space-y:0;">
                    <div style="margin-bottom:14px;">
                        <label style="font-size:8px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;display:block;margin-bottom:5px;">Full Name</label>
                        <input id="pd-input-name" type="text" style="width:100%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px;padding:9px 12px;font-size:11px;font-weight:600;color:#0f172a;outline:none;box-sizing:border-box;" />
                    </div>
                    <div style="margin-bottom:14px;">
                        <label style="font-size:8px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;display:block;margin-bottom:5px;">Email Address</label>
                        <input id="pd-input-email" type="email" style="width:100%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px;padding:9px 12px;font-size:11px;font-weight:600;color:#0f172a;outline:none;box-sizing:border-box;" />
                    </div>
                    <div style="margin-bottom:14px;">
                        <label style="font-size:8px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;display:block;margin-bottom:5px;">Role</label>
                        <input id="pd-input-role" type="text" readonly style="width:100%;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:9px;padding:9px 12px;font-size:11px;font-weight:600;color:#64748b;outline:none;box-sizing:border-box;cursor:not-allowed;" />
                    </div>
                    <button onclick="saveProfileDetails()" style="width:100%;padding:10px;background:#0f172a;color:#fff;border:none;border-radius:10px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;cursor:pointer;transition:background .2s;">
                        <i class="fa-solid fa-check mr-1.5"></i>Save Changes
                    </button>
                    <div id="pd-details-msg" style="display:none;margin-top:10px;padding:8px 12px;border-radius:8px;font-size:9px;font-weight:700;text-align:center;"></div>
                </div>
            </div>

            <!-- PASSWORD TAB -->
            <div id="ppanel-password" style="display:none;">
                <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:10px 12px;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
                    <i class="fa-solid fa-triangle-exclamation" style="color:#d97706;font-size:11px;flex-shrink:0;"></i>
                    <p style="font-size:8px;font-weight:700;color:#92400e;line-height:1.4;">Choose a strong password with at least 8 characters including uppercase, numbers and symbols.</p>
                </div>
                <div style="margin-bottom:14px;">
                    <label style="font-size:8px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;display:block;margin-bottom:5px;">Current Password</label>
                    <div style="position:relative;">
                        <input id="pd-cur-pass" type="password" placeholder="Enter current password" style="width:100%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px;padding:9px 36px 9px 12px;font-size:11px;font-weight:600;color:#0f172a;outline:none;box-sizing:border-box;" />
                        <button onclick="togglePassVis('pd-cur-pass',this)" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94a3b8;"><i class="fa-solid fa-eye" style="font-size:10px;"></i></button>
                    </div>
                </div>
                <div style="margin-bottom:14px;">
                    <label style="font-size:8px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;display:block;margin-bottom:5px;">New Password</label>
                    <div style="position:relative;">
                        <input id="pd-new-pass" type="password" placeholder="Enter new password" oninput="checkPassStrength(this.value)" style="width:100%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px;padding:9px 36px 9px 12px;font-size:11px;font-weight:600;color:#0f172a;outline:none;box-sizing:border-box;" />
                        <button onclick="togglePassVis('pd-new-pass',this)" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94a3b8;"><i class="fa-solid fa-eye" style="font-size:10px;"></i></button>
                    </div>
                    <!-- Strength bar -->
                    <div style="margin-top:6px;height:3px;background:#f1f5f9;border-radius:99px;overflow:hidden;">
                        <div id="pd-strength-bar" style="height:100%;width:0%;border-radius:99px;transition:all .3s;"></div>
                    </div>
                    <p id="pd-strength-label" style="font-size:7px;font-weight:700;color:#94a3b8;margin-top:3px;"></p>
                </div>
                <div style="margin-bottom:20px;">
                    <label style="font-size:8px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;display:block;margin-bottom:5px;">Confirm New Password</label>
                    <div style="position:relative;">
                        <input id="pd-conf-pass" type="password" placeholder="Confirm new password" style="width:100%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px;padding:9px 36px 9px 12px;font-size:11px;font-weight:600;color:#0f172a;outline:none;box-sizing:border-box;" />
                        <button onclick="togglePassVis('pd-conf-pass',this)" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94a3b8;"><i class="fa-solid fa-eye" style="font-size:10px;"></i></button>
                    </div>
                </div>
                <button onclick="changePassword()" style="width:100%;padding:10px;background:#0f172a;color:#fff;border:none;border-radius:10px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;cursor:pointer;">
                    <i class="fa-solid fa-lock mr-1.5"></i>Update Password
                </button>
                <div id="pd-pass-msg" style="display:none;margin-top:10px;padding:8px 12px;border-radius:8px;font-size:9px;font-weight:700;text-align:center;"></div>
            </div>

        </div>

        <!-- Footer -->
        <div style="padding:14px 20px;border-top:1px solid #f1f5f9;flex-shrink:0;">
            <button onclick="if(confirm('Are you sure you want to logout?')){sessionStorage.removeItem('crm_session');window.location.replace('../login/login.html');}" style="width:100%;padding:9px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:10px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">
                <i class="fa-solid fa-right-from-bracket" style="font-size:10px;"></i>Sign Out
            </button>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', drawerHTML);
})();

// ── Open / Close ──
function openProfileDrawer() {
    const s = JSON.parse(sessionStorage.getItem('crm_session') || '{}');
    // Avatar
    const av = document.getElementById('pd-avatar');
    av.textContent = s.avatar || (s.name || 'U').slice(0, 2).toUpperCase();
    av.style.background = s.avatarBg || '#6366f1';
    // Name / email / role
    document.getElementById('pd-name').textContent = s.name || '—';
    document.getElementById('pd-email').textContent = s.email || '—';
    const badge = document.getElementById('pd-role-badge');
    badge.textContent = s.role || '—';
    badge.style.background = '#eef2ff';
    badge.style.color = '#4f46e5';
    // Inputs
    document.getElementById('pd-input-name').value = s.name || '';
    document.getElementById('pd-input-email').value = s.email || '';
    document.getElementById('pd-input-role').value = s.role || '';
    // Reset tabs
    switchProfileTab('details');
    // Show
    document.getElementById('profile-overlay').style.display = 'block';
    document.getElementById('profile-drawer').style.transform = 'translateX(0)';
}

function closeProfileDrawer() {
    document.getElementById('profile-overlay').style.display = 'none';
    document.getElementById('profile-drawer').style.transform = 'translateX(100%)';
}

// ── Tab switching ──
function switchProfileTab(tab) {
    ['details', 'password'].forEach(t => {
        const btn = document.getElementById('ptab-' + t);
        const panel = document.getElementById('ppanel-' + t);
        btn.style.color = '#94a3b8';
        btn.style.borderBottomColor = 'transparent';
        panel.style.display = 'none';
    });
    document.getElementById('ptab-' + tab).style.color = '#0f172a';
    document.getElementById('ptab-' + tab).style.borderBottomColor = '#0f172a';
    document.getElementById('ppanel-' + tab).style.display = 'block';
}

// ── Save Details ──
function saveProfileDetails() {
    const s = JSON.parse(sessionStorage.getItem('crm_session') || '{}');
    s.name = document.getElementById('pd-input-name').value.trim();
    s.email = document.getElementById('pd-input-email').value.trim();
    sessionStorage.setItem('crm_session', JSON.stringify(s));
    // Update header display
    document.getElementById('pd-name').textContent = s.name;
    document.getElementById('pd-email').textContent = s.email;
    document.getElementById('pd-avatar').textContent = s.avatar || s.name.slice(0, 2).toUpperCase();
    showMsg('pd-details-msg', 'Profile updated successfully', '#f0fdf4', '#15803d');
}

// ── Password Change ──
function changePassword() {
    const cur = document.getElementById('pd-cur-pass').value;
    const nw = document.getElementById('pd-new-pass').value;
    const conf = document.getElementById('pd-conf-pass').value;
    if (!cur) return showMsg('pd-pass-msg', 'Enter your current password', '#fef2f2', '#dc2626');
    if (nw.length < 8) return showMsg('pd-pass-msg', 'New password must be at least 8 characters', '#fef2f2', '#dc2626');
    if (nw !== conf) return showMsg('pd-pass-msg', 'Passwords do not match', '#fef2f2', '#dc2626');
    // In a real app this would call an API — here we just confirm
    document.getElementById('pd-cur-pass').value = '';
    document.getElementById('pd-new-pass').value = '';
    document.getElementById('pd-conf-pass').value = '';
    document.getElementById('pd-strength-bar').style.width = '0%';
    document.getElementById('pd-strength-label').textContent = '';
    showMsg('pd-pass-msg', 'Password updated successfully', '#f0fdf4', '#15803d');
}

// ── Password strength ──
function checkPassStrength(val) {
    const bar = document.getElementById('pd-strength-bar');
    const lbl = document.getElementById('pd-strength-label');
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const map = [
        { w: '0%', color: '#f1f5f9', label: '' },
        { w: '25%', color: '#ef4444', label: 'Weak' },
        { w: '50%', color: '#f97316', label: 'Fair' },
        { w: '75%', color: '#eab308', label: 'Good' },
        { w: '100%', color: '#22c55e', label: 'Strong' },
    ];
    bar.style.width = map[score].w;
    bar.style.background = map[score].color;
    lbl.textContent = map[score].label;
    lbl.style.color = map[score].color;
}

// ── Toggle password visibility ──
function togglePassVis(id, btn) {
    const inp = document.getElementById(id);
    const isPass = inp.type === 'password';
    inp.type = isPass ? 'text' : 'password';
    btn.innerHTML = `<i class="fa-solid fa-eye${isPass ? '-slash' : ''}" style="font-size:10px;"></i>`;
}

// ── Helper ──
function showMsg(id, text, bg, color) {
    const el = document.getElementById(id);
    el.textContent = text;
    el.style.display = 'block';
    el.style.background = bg;
    el.style.color = color;
    setTimeout(() => { el.style.display = 'none'; }, 3000);
}
