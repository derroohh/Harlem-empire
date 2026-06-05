package com.android.cardshub;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.squareup.picasso.Picasso;

/**
 * Android Support v4 equivalent of our interactive Hub.
 * Manages Google OAuth, custom light-themed status bars, and floating card fragments.
 */
public class MainActivity extends FragmentActivity implements GoogleApiClient.OnConnectionFailedListener {

    private static final int RC_SIGN_IN = 9001;
    private GoogleApiClient mGoogleApiClient;
    private TextView mStatusText;
    private ImageView mProfileImage;
    private BottomNavigationView mBottomNav;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Bind custom Light-Themed UI Status/Header items
        mStatusText = findViewById(R.id.tv_status_username);
        mProfileImage = findViewById(R.id.iv_statusbar_profile);
        mBottomNav = findViewById(R.id.bottom_navigation);

        // Configure Google Sign-In with standard scopes (Email, Profile, OpenID)
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestProfile()
                .build();

        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .enableAutoManage(this, this)
                .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
                .build();

        setupBottomNavigation();
        loadFragment(new HomeFragment());
        
        // Action trigger sign-in if not authenticated (similar to our lock screen)
        findViewById(R.id.btn_google_oauth_signin).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                signIn();
            }
        });
    }

    private void signIn() {
        Intent signInIntent = Auth.GoogleSignInApi.getSignInIntent(mGoogleApiClient);
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_SIGN_IN) {
            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            handleSignInResult(result);
        }
    }

    private void handleSignInResult(GoogleSignInResult result) {
        if (result.isSuccess()) {
            GoogleSignInAccount acct = result.getSignInAccount();
            if (acct != null) {
                mStatusText.setText(acct.getDisplayName());
                if (acct.getPhotoUrl() != null) {
                    Picasso.get()
                            .load(acct.getPhotoUrl())
                            .placeholder(R.drawable.ic_default_avatar)
                            .into(mProfileImage);
                }
                
                // Hide Login Card, show main Workspace
                findViewById(R.id.login_card_root).setVisibility(View.GONE);
                findViewById(R.id.android_screen_workspace).setVisibility(View.VISIBLE);
                mBottomNav.setVisibility(View.VISIBLE);
                
                Toast.makeText(this, "Welcome " + acct.getDisplayName(), Toast.LENGTH_SHORT).show();
            }
        } else {
            Toast.makeText(this, "Sign In Failed. Try again.", Toast.LENGTH_LONG).show();
        }
    }

    private void setupBottomNavigation() {
        mBottomNav.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                Fragment selectedFragment = null;
                switch (item.getItemId()) {
                    case R.id.nav_home:
                        selectedFragment = new HomeFragment();
                        break;
                    case R.id.nav_discover:
                        selectedFragment = new DiscoverFragment();
                        break;
                    case R.id.nav_tools:
                        selectedFragment = new ToolsFragment();
                        break;
                    case R.id.nav_account:
                        selectedFragment = new AccountFragment();
                        break;
                }
                return loadFragment(selectedFragment);
            }
        });
    }

    private boolean loadFragment(Fragment fragment) {
        if (fragment != null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment_container, fragment)
                    .commit();
            return true;
        }
        return false;
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        Toast.makeText(this, "Google Play Services connection failed.", Toast.LENGTH_SHORT).show();
    }
}
