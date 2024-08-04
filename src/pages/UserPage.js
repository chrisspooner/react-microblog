import { useState, useEffect } from 'react';
import { Stack, Image, Spinner, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Body from '../components/Body';
import TimeAgo from '../components/TimeAgo';
import { useApi } from '../contexts/ApiProvider';
import Posts from '../components/Posts';
import { useUser } from '../contexts/UserProvider';
import { useFlash } from '../contexts/FlashProvider';

export default function UserPage() {
  const { username } = useParams();
  const { user: loggedInUser} = useUser();
  const [user, setUser] = useState();
  const [isFollower, setIsFollower] = useState();
  const api = useApi();
  const flash = useFlash();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await api.get('/users/' + username);
      if (response.ok) {
        setUser(response.body);
        if (response.body.username !== loggedInUser.username) {
          const follower = await api.get(
            '/me/following/' + response.body.id);
          if (follower.status === 204) {
            setIsFollower(true);
          }
          else if (follower.status === 404) {
            setIsFollower(false);
          }
        }
        else {
          setIsFollower(null);
        }
      }
      else {
        setUser(null);
      }
    })();
  }, [username, api, loggedInUser]);

  const edit = () => {
    navigate('/edit');
  };

  const follow = async () => {
    const response = await api.post('/me/following/' + user.id);
    if (response.ok) {
      flash(
        <>
          You are now following <b>{user.username}</b>.
        </>, 'success'
      );
      setIsFollower(true);
    }
  };

  const unfollow = async() => {
    const response = await api.delete('/me/following/' + user.id);
    if (response.ok) {
      flash(
        <>
          You have unfollowed <b>{user.username}</b>.
        </>, 'success'
      );
      setIsFollower(false);
    }
  }

  return (
    <Body sidebar>
      {user === undefined ?
        <Spinner animation="border" />
      :
        <>
          {user === null ?
            <p>User not found.</p>
          :
          <>
            <Stack direction="horizontal" gap={4}>
            <Image src={user.avatar_url + '&s=128'} roundedCircle />
              <div>
                <h1>{user.username}</h1>
                {user.about_me && <h5>{user.about_me}</h5>}
                <p>
                  Member since: <TimeAgo isoDate={user.first_seen} />
                  <br />
                  Last seen: <TimeAgo isoDate={user.last_seen} />
                </p>
                
                {isFollower === null &&
                  <Button vairant="primary" onClick={edit}>
                    Edit
                  </Button>
                }
                {isFollower === false &&
                  <Button vairant="primary" onClick={follow}>
                    Follow
                  </Button>
                }
                {isFollower === true &&
                  <Button vairant="primary" onClick={unfollow}>
                    Unfollow
                  </Button>
                }
              </div>
            </Stack>
            <Posts content={user.id} />
          </>
          }
        </>
      }
    </Body>
  );
}