		$(function(){
			$('#gallery').each(function(){
				var $container = $(this),
					$LoadMoreButton = $('#load-more'),
					$filter = $('#gallery-filter'),
					addItemCount = 16,
					added = 0,
					allData = [],
					filteredData = [];

				// masonryのオプション設定
				$container.masonry({
					columnWidth: 30,
					gutter: 10,
					itemSelector: '.gallery-item'
				});
				
				$.getJSON('data/content.json',initGallery);
				
				// ギャラリーを初期化する
				function initGallery(data){
					// 全JSONデータを引渡し
					allData = data;
					// 初期化なのでフィルタしない
					filteredData = allData;
					// 一番最初のアイテムの表示
					addItems();
					// Loadボタンが押されたら、アイテムを追加する
					$LoadMoreButton.on('click',addItems);
					// Form内に変化があった時、フィルタをかける
					$filter.on('change','input[type=radio]',filterItems);
				}

				function addItems(filter){
					var elements = [],
					// 追加するデータの配列の一部を取り出す。16枚ずつ増やして表示
					sliceData = filteredData.slice(added , added + addItemCount);

					$.each(sliceData,function(i , item){
						var itemHTML = 
							'<li class="gallery-item is-loading">' +
								'<a href="' + item.images.large + '"> ' +
									'<img src="' + item.images.thumb + '" alt=""> ' +
									'<span class="caption">' +
										'<span class="inner"> ' + 
											'　　<b onclick=javascript:window.open("' + item.datalink + '","_blank"); class="ImgTitle">' + item.title + '</b>　←オライリーへ' +
										'</span>' +
									'</span>' +
								'</a>' +
							'</li>';
						// elements.push -> 配列の最後に入れる
						// $(itemHTML) -> 文字列をhtml要素に変換する
						// .get(0) -> 一番最初の要素を取得する
						elements.push($(itemHTML).get(0));
					});

					// .append(elements) -> 配列の要素をギャラリーの後ろにくっつける
					//.imagesLoaded -> 画像をロード
					// $container.masonry -> 表示
					$container
					.append(elements)
					.imagesLoaded(function(){
						$(elements).removeClass('is-loading');
						$container.masonry('appended',elements);
						//
						if(filter){
							$container.masonry();
						}
					});

					// colorbox表示用の設定。サイズとタイトルを設定
					$container.find('a').colorbox({
						rel: true,
						width: '70%',
						height: '70%',
						closeButton: false,
						title: function(){
							return $(this).find('.inner').html();
						}
					});

					// 追加済みのアイテムの数を更新
					added += sliceData.length;
					// 「もっと表示」ボタンの表示・非表示
					// 全部の画像が表示し終わっていたらボタンを消す
					if(added < filteredData.length){
						$LoadMoreButton.show();
					} else {
						$LoadMoreButton.hide();
					}
				}
				// 絞られた要素をフィルタして、filteredDataに入れなおす
				function filterItems(){
					// changesメソッドを呼ぶきっかけになったコントロールの値を取得
					var key = $(this).val(),
					// 今現在表示されているmasonryの要素を取得
					masonryItems = $container.masonry('getItemElements');
					// 登録されている要素を全て消去
					$container.masonry('remove',masonryItems);
					// フィルタデータと、ロードのカウントを初期化
					filteredData = [];
					added = 0;
					// フィルタチェック
					if(key === 'all'){
						// フィルタ不要なら全部のデータを突っ込む
						filteredData = allData;
					} else {
						// フィルタがいるならJSONからキーに合致するものだけをgrepして返す
						filteredData = $.grep(allData,function(item){
							// JSONのcategoryは押されたkeyと同じもの
							return item.category === key;
						});
					}
					// Itemを追加する
					addItems(true);
				}
			});
		});